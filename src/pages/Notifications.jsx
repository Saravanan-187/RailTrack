import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationContext";
import { Check, Trash2, BellOff } from "lucide-react";

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAllNotifications } = useNotifications();
  const [filter, setFilter] = useState("all");

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your bookings and alerts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                {notifications.length} notifications ({notifications.filter(n => !n.read).length} unread)
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={filter === "unread" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Unread
              </Button>
              <Button 
                variant={filter === "read" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("read")}
              >
                Read
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={notifications.filter(n => !n.read).length === 0}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <BellOff className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {notifications.length === 0 ? "No notifications yet" : "No matching notifications"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {notifications.length === 0 
                  ? "You'll see notifications about your bookings here." 
                  : "Try adjusting your filter criteria."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border ${
                    notification.read ? "bg-secondary/10" : "bg-primary/5 border-primary/20"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;