"use client";

import { $api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Eye } from "lucide-react";

type FormPermission = "public" | "private";
interface CreateFormData {
  title: string;
  description: string;
  permission: FormPermission;
  sharedEmails: string[];
}

export default function CreateFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateFormData>({
    title: "",
    description: "",
    permission: "private",
    sharedEmails: [],
  });
  const [emailInput, setEmailInput] = useState("");
  const t = useTranslations('forms.create');

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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Form Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t('form.title.label')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('form.title.label')}</Label>
                  <Input
                    id="title"
                    placeholder={t('form.title.placeholder')}
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    minLength={3}
                    maxLength={100}
                    className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    aria-label="Название формы"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t('form.description.label')}</Label>
                  <Textarea
                    id="description"
                    placeholder={t('form.description.placeholder')}
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    aria-label="Описание формы"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Builder */}
          <Card>
            <CardHeader>
              <CardTitle>{t('builder.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('builder.addField')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>{t('builder.fields.text')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('builder.fields.number')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('builder.fields.select')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('builder.fields.multiSelect')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('builder.fields.date')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('builder.fields.time')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('builder.fields.email')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('builder.fields.phone')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('builder.fields.textarea')}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    {t('builder.preview')}
                  </Button>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">{t('builder.actions.cancel')}</Button>
                  <Button>{t('builder.actions.save')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
