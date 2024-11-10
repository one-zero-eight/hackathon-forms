"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { $api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function FormsPage() {
  const tCommon = useTranslations("common");
  const tForms = useTranslations("forms");
  const { data: forms, isPending, error } = $api.useQuery("get", "/form/");

  const queryClient = useQueryClient();
  const { mutate: deleteForm } = $api.useMutation("delete", "/form/{form_id}", {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: $api.queryOptions("get", "/form/").queryKey,
      });
    },
  });

  const handleDelete = async (formId: string) => {
    deleteForm({ params: { path: { form_id: formId } } });
  };

  if (isPending) {
    return (
      <div
        className="flex min-h-[400px] items-center justify-center"
        role="status"
        aria-label={tCommon("loading")}
      >
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{tCommon("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-[400px] flex-col items-center justify-center text-center"
        role="alert"
      >
        <p className="mb-4 text-destructive">{String(error)}</p>
        <Button
          onClick={() => window.location.reload()}
          aria-label="Retry loading forms"
        >
          {tCommon("error.tryAgain")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">{tForms("list.title")}</h1>
        <Button asChild>
          <Link href="/forms/create">
            <Plus className="mr-2" />
            {tForms("list.createNew")}
          </Link>
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="mb-4 text-muted-foreground">{tForms("list.empty")}</p>
            <Link href="/forms/create">
              <Button aria-label={tForms("list.createFirst")}>
                {tForms("list.createFirst")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          role="list"
          aria-label={tForms("list.title")}
        >
          {forms
            .filter((form) => form.deleted_at === null)
            .map((form) => (
              <Card
                key={form.id}
                className="flex h-full flex-col"
                role="listitem"
              >
                <CardHeader className="flex-none">
                  <CardTitle className="line-clamp-2 text-xl">
                    {form.title}
                  </CardTitle>
                  <CardDescription>
                    {form.description && (
                      <p className="mb-2 line-clamp-2 text-sm">
                        {form.description}
                      </p>
                    )}
                    <p className="text-sm">
                      {tForms("list.createdOn")}:{" "}
                      {form.created_at
                        ? new Date(form.created_at).toLocaleDateString()
                        : "Unknown date"}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 items-end pt-4">
                  <div className="flex w-full gap-2">
                    <Link
                      href={`/forms/${form.id}/edit`}
                      className="flex-1"
                      aria-label={tCommon("actions.edit")}
                    >
                      <Button variant="outline" className="h-9 w-full">
                        {tCommon("actions.edit")}
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Delete form: ${form.title}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {tCommon("actions.delete")}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {tCommon("actions.deleteConfirm")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {tCommon("actions.cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDelete(form.id)}
                          >
                            {tCommon("actions.delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
