// app/notifications/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Notification, 
  getAllNotifications,
  getNotificationSummary,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "@/app/api/notification";
import Link from "next/link";
import { IoArrowBack, IoCheckmarkDone, IoEye } from "react-icons/io5";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, unread: 0, read: 0 });
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [markingIds, setMarkingIds] = useState<Set<string>>(new Set());

  // Fetch data function
  const fetchData = useCallback(async (pageNum: number = 1, reset: boolean = true) => {
    try {
      setIsLoading(true);
      
      // Fetch summary
      const summaryData = await getNotificationSummary();
      setSummary(summaryData);
      
      // Fetch notifications
      const { notifications: newNotifications, totalCount } = await getAllNotifications(pageNum, 20);
      
      if (reset) {
        setNotifications(newNotifications);
        setPage(pageNum);
      } else {
        setNotifications(prev => [...prev, ...newNotifications]);
      }
      
      // Check if there are more pages
      const totalPages = Math.ceil(totalCount / 20);
      setHasMore(pageNum < totalPages);
      
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData(1, true);
  }, [fetchData]);

  // Filter notifications when activeFilter changes
  useEffect(() => {
    let filtered = notifications;
    
    if (activeFilter === 'unread') {
      filtered = notifications.filter(n => !n.isRead);
    } else if (activeFilter === 'read') {
      filtered = notifications.filter(n => n.isRead);
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, activeFilter]);

  // Mark single notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setMarkingIds(prev => new Set(prev).add(notificationId));
      
      const success = await markNotificationAsRead(notificationId);
      
      if (success) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        
        // Update summary
        setSummary(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
          read: prev.read + 1
        }));
      }
      
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setMarkingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (summary.unread === 0) return;
    
    try {
      setIsMarkingAll(true);
      
      const success = await markAllNotificationsAsRead();
      
      if (success) {
        // Update all notifications to read
        setNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true }))
        );
        
        // Update summary
        setSummary(prev => ({
          total: prev.total,
          unread: 0,
          read: prev.total
        }));
      }
      
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (hasMore && !isLoading) {
      fetchData(page + 1, false);
    }
  };

  // Group notifications by date
  const groupByDate = (notifs: Notification[]) => {
    const groups: Record<string, Notification[]> = {};
    
    notifs.forEach(notification => {
      const date = new Date(notification.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey: string;
      
      if (date.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = "Yesterday";
      } else {
        dateKey = date.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(notification);
    });
    
    return groups;
  };

  const groupedNotifications = groupByDate(filteredNotifications);

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-gray-600 hover:text-primary mb-4"
        >
          <IoArrowBack className="mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-600">
              {summary.unread > 0 ? (
                <span className="text-primary font-medium">{summary.unread} unread</span>
              ) : (
                <span className="text-green-600">All caught up!</span>
              )}
              {" • "}
              <span>{summary.total} total notifications</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Filter buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({summary.total})
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeFilter === 'unread' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Unread ({summary.unread})
              </button>
              <button
                onClick={() => setActiveFilter('read')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeFilter === 'read' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Read ({summary.read})
              </button>
            </div>
            
            {/* Mark all as read button */}
            {summary.unread > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <IoCheckmarkDone />
                {isMarkingAll ? "Processing..." : "Mark all as read"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading && notifications.length === 0 ? (
          // Loading skeleton
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-3 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          // Empty state
          <div className="p-12 text-center">
            <div className="text-gray-300 text-4xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500">
              {activeFilter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "No notifications to display for this filter."
              }
            </p>
          </div>
        ) : (
          // Notifications list
          <div className="divide-y divide-gray-100">
            {Object.entries(groupedNotifications).map(([date, notifs]) => (
              <div key={date}>
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700">{date}</h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {notifs.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Status indicator */}
                        <div className="shrink-0">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            !notification.isRead 
                              ? 'bg-[#A243DC] animate-pulse' 
                              : 'bg-gray-300'
                          }`}></div>
                        </div>
                        
                        {/* Notification content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatTime(notification.createdAt)}
                              </span>
                              
                              {/* Mark as read button for unread notifications */}
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  disabled={markingIds.has(notification.id)}
                                  className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 disabled:opacity-50"
                                  title="Mark as read"
                                >
                                  <IoEye />
                                  {markingIds.has(notification.id) ? "Marking..." : "Mark read"}
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          
                          {/* Metadata (if available) */}
                          {notification.metadata && (
                            <div className="mt-2 space-y-1">
                              {notification.metadata.amount && (
                                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                  ₦{Number(notification.metadata.amount).toLocaleString()}
                                </span>
                              )}
                              {notification.metadata.planId && (
                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded ml-2">
                                  Plan ID: {notification.metadata.planId.slice(0, 8)}...
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {notification.type}
                            </span>
                            {!notification.isRead && (
                              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load more button */}
      {hasMore && filteredNotifications.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load more notifications"}
          </button>
        </div>
      )}
    </div>
  );
}