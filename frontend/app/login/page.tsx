"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { $api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [verification_code, setVerification_code] = useState("");

  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending: loginIsPending,
    error: loginError,
    data: loginData,
    isSuccess: loginIsSuccess,
  } = $api.useMutation("post", "/email/login");

  const {
    mutate: verifyCode,
    isPending: verifyIsPending,
    error: verifyError,
  } = $api.useMutation("post", "/email/validate-code-for-users", {
    onSuccess: () => {
      queryClient.clear();
      router.push("/forms");
    },
  });

  const handleEmailSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;
    login({ body: { email } });
  };

  const handleOtpSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const email_flow_id = loginData?.email_flow_id;
    if (!email_flow_id || !verification_code) return;
    verifyCode({ body: { email_flow_id, verification_code } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!loginIsSuccess) {
        handleEmailSubmit();
      } else {
        handleOtpSubmit();
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Добро пожаловать
          </CardTitle>
          <CardDescription>
            {!loginIsSuccess
              ? "Введите вашу почту, чтобы получить код доступа"
              : "Введите код, который мы отправили на вашу почту"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(loginError || verifyError) && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {loginError?.detail?.toString() ||
                verifyError?.detail?.toString() ||
                "Произошла ошибка"}
            </div>
          )}

          <form
            onSubmit={loginIsSuccess ? handleOtpSubmit : handleEmailSubmit}
            className="space-y-4"
          >
            {!loginIsSuccess ? (
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Электронная почта
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Введите email"
                  required
                  disabled={loginIsPending}
                  aria-label="Email address"
                  className="h-10"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Код доступа
                </label>
                <InputOTP
                  maxLength={6}
                  value={verification_code}
                  onChange={(value) => setVerification_code(value)}
                  disabled={loginIsPending}
                  aria-label="One-Time Password"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loginIsPending || verifyIsPending}
              size="lg"
            >
              {(loginIsPending || verifyIsPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {!loginIsSuccess ? "Получить код" : "Отправить код"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
