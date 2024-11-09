'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  functional: boolean
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true as these are essential
    analytics: true,
    functional: true,
  })

  useEffect(() => {
    // Check if user has already set cookie preferences
    const savedPreferences = localStorage.getItem('cookiePreferences')
    if (!savedPreferences) {
      setIsVisible(true)
    } else {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const acceptAllCookies = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      functional: true,
    }
    localStorage.setItem('cookiePreferences', JSON.stringify(allPreferences))
    setPreferences(allPreferences)
    setIsVisible(false)
  }

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    setIsVisible(false)
    setShowPreferences(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 p-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            Мы используем файлы cookie для улучшения работы сайта. Вы можете настроить использование cookie или принять все.{' '}
            <a href="/privacy" className="underline hover:text-foreground">
              Подробнее о cookie
            </a>
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowPreferences(true)}
              className="shrink-0"
            >
              Настроить
            </Button>
            <Button 
              onClick={acceptAllCookies} 
              className="shrink-0"
            >
              Принять все
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Настройки Cookie</DialogTitle>
            <DialogDescription>
              Выберите, какие типы cookie вы разрешаете использовать на сайте.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Необходимые</Label>
                <p className="text-sm text-muted-foreground">
                  Требуются для работы сайта
                </p>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Аналитические</Label>
                <p className="text-sm text-muted-foreground">
                  Помогают улучшать сайт
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, analytics: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Функциональные</Label>
                <p className="text-sm text-muted-foreground">
                  Расширенные функции сайта
                </p>
              </div>
              <Switch
                checked={preferences.functional}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, functional: checked }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={savePreferences}>Сохранить настройки</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 