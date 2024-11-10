"use client";

import { $api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormPermission = "public" | "private";

interface CreateFormData {
  title: string;
  description: string;
  permission: FormPermission;
  sharedEmails: string[];
}

export default function CreateFormPage() {
  const t = useTranslations("forms.create");

  const router = useRouter();
  const [formData, setFormData] = useState<CreateFormData>({
    title: "",
    description: "",
    permission: "private",
    sharedEmails: [],
  });
  const [emailInput, setEmailInput] = useState("");

  const { mutate: createForm, isPending } = $api.useMutation("post", "/form/", {
    onSuccess: (data) => {
      router.push(`/forms/${data.id}/edit`);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (permission: FormPermission) => {
    setFormData((prev) => ({
      ...prev,
      permission,
    }));
  };

  const handleAddEmail = () => {
    if (!emailInput) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      alert("Пожалуйста, введите корректный email адрес");
      return;
    }

    if (formData.sharedEmails.includes(emailInput)) {
      alert("Этот email уже добавлен");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sharedEmails: [...prev.sharedEmails, emailInput],
    }));
    setEmailInput("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      sharedEmails: prev.sharedEmails.filter(
        (email) => email !== emailToRemove,
      ),
    }));
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createForm({
      body: {
        title: formData.title,
        description: formData.description,
        nodes: [],
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="container max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t("form.title.label")}</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  minLength={3}
                  maxLength={100}
                  placeholder={t("form.title.placeholder")}
                  aria-label={t("form.title.label")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("form.description.label")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t("form.description.placeholder")}
                  aria-label={t("form.description.label")}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full"
              >
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("form.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
