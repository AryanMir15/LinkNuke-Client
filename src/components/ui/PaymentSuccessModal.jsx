import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "./navigation-menu";

export default function PaymentSuccessModal() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/dashboard";
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl p-8 max-w-md w-full space-y-4 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold">Welcome Aboard!</h2>
        <p className="text-muted-foreground">
          Your subscription is now active. Redirecting to dashboard in 5
          seconds...
        </p>
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="w-full"
        >
          Go to Dashboard Now
        </Button>
      </div>
    </div>
  );
}
