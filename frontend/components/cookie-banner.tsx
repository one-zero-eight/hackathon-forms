'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('cookies')
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
            {t('banner.description')}{' '}
            <Link href="/privacy" className="underline hover:text-foreground">
              {t('banner.learnMore')}
            </Link>
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowPreferences(true)}
              className="shrink-0"
            >
              {t('banner.customize')}
            </Button>
            <Button 
              onClick={acceptAllCookies} 
              className="shrink-0"
            >
              {t('banner.acceptAll')}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('preferences.title')}</DialogTitle>
            <DialogDescription>
              {t('preferences.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('preferences.necessary.title')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('preferences.necessary.description')}
                </p>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('preferences.analytics.title')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('preferences.analytics.description')}
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
                <Label>{t('preferences.functional.title')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('preferences.functional.description')}
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
            <Button onClick={savePreferences}>{t('preferences.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}