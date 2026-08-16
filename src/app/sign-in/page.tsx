"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { api } from "~/trpc/react"
import { Button } from "~/shared/ui/button"
import { Input } from "~/shared/ui/input"
import { Label } from "~/shared/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/shared/ui/card"

export default function AuthPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createUser = api.user.create.useMutation({
    onSuccess: async (_, variables) => {
      const result = await signIn("credentials", {
        login: variables.login,
        password: variables.password,
        redirect: false,
      })
      if (result?.error) {
        setError("Registration succeeded but sign in failed")
      } else {
        router.push("/")
      }
      setIsLoading(false)
    },
    onError: (error) => {
      setError(error.message)
      setIsLoading(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const form = e.currentTarget
    const login = (form.elements.namedItem("login") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    if (isSignUp) {
      createUser.mutate({ login, password })
    } else {
      const result = await signIn("credentials", {
        login,
        password,
        redirect: false,
      })
      setIsLoading(false)
      if (result?.error) {
        setError("Invalid login or password")
      } else {
        router.push("/")
      }
    }
  }
  
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isSignUp ? "Sign up" : "Sign in"}
          </CardTitle>
          <CardDescription>
            {isSignUp ? "Create a new account" : "Login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                name="login"
                type="text"
                placeholder="Enter login"
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : isSignUp ? "Sign up" : "Sign in"}
              
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => { setIsSignUp(!isSignUp); setError("") }}
            >
              {isSignUp ? "Already have an account? Sign in" : "No account? Sign up"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full focus-visible:ring-primary"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Sign in with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}