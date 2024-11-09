"use client";

import { $api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

type FormPermission = "public" | "private";

interface CreateFormData {
  title: string;
  description: string;
  permission: FormPermission;
  sharedEmails: string[];
}

export default function CreateFormPage() {
  const t = useTranslations('forms.create');
  const tCommon = useTranslations('common');
  
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
    <div className="max-w-2xl mx-auto p-7">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            {t('form.title.label')}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            minLength={3}
            maxLength={100}
            className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder={t('form.title.placeholder')}
            aria-label={t('form.title.label')}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            {t('form.description.label')}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder={t('form.description.placeholder')}
            aria-label={t('form.description.label')}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('form.access.label')}
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handlePermissionChange("private")}
              className={`rounded-lg border px-4 py-2 ${
                formData.permission === "private"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
              aria-pressed={formData.permission === "private"}
            >
              {t('form.access.private')}
            </button>
            <button
              type="button"
              onClick={() => handlePermissionChange("public")}
              className={`rounded-lg border px-4 py-2 ${
                formData.permission === "public"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
              aria-pressed={formData.permission === "public"}
            >
              {t('form.access.public')}
            </button>
          </div>
        </div>

        {formData.permission === "private" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('form.sharing.label')}
            </label>
            <div className="flex space-x-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleEmailKeyDown}
                className="flex-1 rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder={t('form.sharing.placeholder')}
              />
              <button
                type="button"
                onClick={handleAddEmail}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                {t('form.sharing.add')}
              </button>
            </div>
            {formData.sharedEmails.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.sharedEmails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-2"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="text-red-500 hover:text-red-700"
                    >
                      {tCommon('actions.delete')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
          {t('form.submit')}
        </button>
      </form>
    </div>
  );
}
