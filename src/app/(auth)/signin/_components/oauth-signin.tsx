"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { createGoogleAuthorizationURL } from "@/lib/actions/auth.actions"
import { toast } from "@/components/ui/use-toast"


export function OAuthSignIn() {

  const [isLoading, setIsLoading] = React.useState<any | null>(null)

  const signInLoaded = true
  async function oauthSignIn(provider: any) {
    console.log("🚀 ~ oauthSignIn ~ provider", provider)
    const res = await createGoogleAuthorizationURL()
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      window.location.href = res.data.toString()
    }
  }


  const oauthProviders = [
    { name: "Google", icon: "google" },
    { name: "Github", icon: "gitHub" },
    { name: "Discord", icon: "discord" },
  ] satisfies {
    name: string
    icon: keyof typeof Icons
  }[]

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon]

        return (
          <Button
            key={provider.name}
            aria-label={`Sign in with ${provider.name}`}
            variant="outline"
            className="w-full bg-background sm:w-auto"
            disabled={isLoading !== null}
            onClick={() => oauthSignIn(provider)}
          >
            {isLoading ? (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icon className="mr-2 size-4" aria-hidden="true" />
            )}
            {provider.name}
          </Button>
        )
      })}
    </div>
  )
}