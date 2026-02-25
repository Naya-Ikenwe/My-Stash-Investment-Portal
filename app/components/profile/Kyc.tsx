"use client";

import { useState, useEffect } from "react";
import FileDropzone from "./FileInput";
import { Button } from "@/components/ui/button";
import { uploadKycDocumentsService, getKycDocumentsService } from "@/app/api/Users";
import { RefreshCw, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface KycDocument {
  type: string;
  name: string;
  status: DocumentStatus;
}

const DOCUMENT_CONFIG = [
  {
    field: "meansOfIdentification",
    label: "Means of Identification",
    acceptedFiles: "image/*,.pdf",
    maxSize: 5 * 1024 * 1024,
    needsType: true,
    backendType: "IDENTITY",
    options: [
      { value: "nationalId", label: "National ID" },
      { value: "driverLicense", label: "Driver's License" },
      { value: "internationalPasport", label: "International Passport" }
    ]
  },
  {
    field: "proofOfAddress", 
    label: "Proof of Address",
    acceptedFiles: "image/*,.pdf",
    maxSize: 5 * 1024 * 1024,
    needsType: true,
    backendType: "ADDRESS",
    options: [
      { value: "electricity", label: "Electricity Bill" },
      { value: "lawma", label: "Lawma Bill" }
    ]
  },
  {
    field: "passportPhotograph",
    label: "Passport Photograph",
    acceptedFiles: "image/*",
    maxSize: 2 * 1024 * 1024,
    needsType: false,
    backendType: "PASSPORT",
    options: []
  },
  {
    field: "digitalSignature",
    label: "Digital Signature",
    acceptedFiles: "image/*",
    maxSize: 2 * 1024 * 1024,
    needsType: false,
    backendType: "SIGNATURE",
    options: []
  }
];

export default function Kyc({ isMobile = false }: { isMobile?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [existingDocuments, setExistingDocuments] = useState<KycDocument[]>([]);
  const [files, setFiles] = useState<Record<string, File | null>>({
    meansOfIdentification: null,
    proofOfAddress: null,
    passportPhotograph: null,
    digitalSignature: null,
  });
  const [documentTypes, setDocumentTypes] = useState<Record<string, string>>({
    meansOfIdentification: "",
    proofOfAddress: "",
  });
  const [changingDocument, setChangingDocument] = useState<Record<string, boolean>>({
    meansOfIdentification: false,
    proofOfAddress: false,
    passportPhotograph: false,
    digitalSignature: false,
  });

  const fetchDocuments = async () => {
    try {
      setFetching(true);
      const response = await getKycDocumentsService();
      
      if (response.data?.kycdocuments) {
        setExistingDocuments(response.data.kycdocuments);
      }
    } catch (error) {
      console.error("Failed to fetch KYC documents:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const getExistingDocument = (field: string) => {
    const config = DOCUMENT_CONFIG.find(c => c.field === field);
    if (!config) return undefined;
    
    return existingDocuments.find(doc => doc.type === config.backendType);
  };

  const handleFileSelect = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleDocumentTypeChange = (field: string, value: string) => {
    setDocumentTypes(prev => ({ ...prev, [field]: value }));
  };

  const handleChangeDocument = (field: string) => {
    // Set changing state to true, which will show upload section
    setChangingDocument(prev => ({ ...prev, [field]: true }));
    // Clear any selected file
    setFiles(prev => ({ ...prev, [field]: null }));
    // Clear document type if applicable
    if (DOCUMENT_CONFIG.find(c => c.field === field)?.needsType) {
      setDocumentTypes(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCancelChange = (field: string) => {
    // Cancel changing, go back to showing existing document
    setChangingDocument(prev => ({ ...prev, [field]: false }));
    setFiles(prev => ({ ...prev, [field]: null }));
  };

  const onSubmit = async () => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");

    try {
      const filesToUpload = Object.values(files).filter(file => file !== null);
      
      if (filesToUpload.length === 0) {
        setApiError("Please select at least one document to upload");
        setLoading(false);
        return;
      }

      // Validate document types
      const missingTypes = [];
      if (files.meansOfIdentification && !documentTypes.meansOfIdentification) {
        missingTypes.push("Means of Identification type");
      }
      if (files.proofOfAddress && !documentTypes.proofOfAddress) {
        missingTypes.push("Proof of Address type");
      }
      
      if (missingTypes.length > 0) {
        setApiError(`Please select: ${missingTypes.join(", ")}`);
        setLoading(false);
        return;
      }

      const formData = new FormData();
      
      Object.entries(files).forEach(([field, file]) => {
        if (file) {
          formData.append(field, file);
        }
      });

      const response = await uploadKycDocumentsService(formData);
      
      if (response.status === "success") {
        setApiSuccess("Documents uploaded successfully!");
        
        // Refresh documents
        setTimeout(async () => {
          await fetchDocuments();
        }, 1000);
        
        // Reset all states
        setFiles({
          meansOfIdentification: null,
          proofOfAddress: null,
          passportPhotograph: null,
          digitalSignature: null,
        });
        setDocumentTypes({
          meansOfIdentification: "",
          proofOfAddress: "",
        });
        setChangingDocument({
          meansOfIdentification: false,
          proofOfAddress: false,
          passportPhotograph: false,
          digitalSignature: false,
        });
        
        setTimeout(() => setApiSuccess(""), 5000);
      } else {
        setApiError(response.message || "Upload failed");
      }
      
    } catch (error: any) {
      console.error("Upload failed:", error);
      setApiError(error.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentSection = (config: typeof DOCUMENT_CONFIG[0]) => {
    const existingDoc = getExistingDocument(config.field);
    const hasNewFile = files[config.field] !== null;
    const isChanging = changingDocument[config.field];

    return (
      <div key={config.field} className="mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{config.label}</h3>
          
          {existingDoc && !isChanging && !hasNewFile && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleChangeDocument(config.field)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Change
            </Button>
          )}
        </div>

        {existingDoc && !isChanging && !hasNewFile ? (
          // Show existing document (when NOT changing)
          <div className="p-3 bg-white rounded border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{existingDoc.name}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    Status: {existingDoc.status.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Show upload section (when changing OR no document exists)
          <div>
            {config.needsType && (
              <div className="mb-4">
                <Select 
                  value={documentTypes[config.field] || ""}
                  onValueChange={(value) => handleDocumentTypeChange(config.field, value)}
                >
                  <SelectTrigger className="bg-white min-h-12">
                    <SelectValue placeholder={`Select ${config.label} type`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {config.options.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <FileDropzone 
              onFileSelect={(file) => handleFileSelect(config.field, file)}
              acceptedFiles={config.acceptedFiles}
              maxSize={config.maxSize}
            />
            
            {hasNewFile && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">
                  ✓ Selected: <span className="font-medium">{files[config.field]?.name}</span>
                </p>
              </div>
            )}
            
            {(existingDoc || isChanging) && (
              <div className="flex gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCancelChange(config.field)}
                >
                  {existingDoc ? "Cancel" : "Clear"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="pb-14">
      <div>
        <p className="text-[#455A64] font-medium text-[16px] mb-2">
          KYC Documents
        </p>
        <hr className="border-[#455A6433]" />
      </div>

      <div className="mt-6">
        <p>Manage your KYC documents. Uploaded documents will be reviewed.</p>

        {apiSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-600 text-sm">{apiSuccess}</p>
          </div>
        )}
        
        {apiError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">{apiError}</p>
          </div>
        )}

        {fetching ? (
          <div className="mt-8 p-8 text-center">
            <p className="text-gray-500">Loading documents...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mt-6">
            <div className="space-y-4">
              {DOCUMENT_CONFIG.map(config => renderDocumentSection(config))}
            </div>

            {Object.values(files).some(file => file !== null) && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={onSubmit}
                  disabled={loading}
                  className="px-8"
                >
                  {loading ? "Uploading..." : "Upload Selected Documents"}
                </Button>
              </div>
            )}

            {existingDocuments.length > 0 && 
             Object.values(files).every(file => file === null) &&
             Object.values(changingDocument).every(changing => !changing) && (
              <div className="text-center mt-8 p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-700">
                  ✅ All documents are uploaded. Click "Change" to upload a new version.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}