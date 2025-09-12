import Icon from "@/components/ui/icon";

interface NotificationProps {
  message: string | null;
}

const Notification = ({ message }: NotificationProps) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in">
      <div className="flex items-center space-x-2">
        <Icon name="Check" size={16} />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;