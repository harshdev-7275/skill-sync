"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { avatars } from "../lib/importAvatar"
import axiosInstance from "../lib/axiosInstance"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { setUser } from "../slices/userSlice"

export default function CompleteProfile() {
  const { toast } = useToast()
  const token = useSelector((state: RootState) => state.auth.token)
  const avatar = useSelector((state: RootState) => state.user.avatar)
  const username = useSelector((state: RootState) => state.user.username)
  const email = useSelector((state: RootState) => state.user.email)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [avatarSelected, setAvatarSelected] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const [userProfile, setUserProfile] = useState({
    avatar: avatar,
    username: username,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
  const [usernameError, setUsernameError] = useState<string>("")
  useEffect(() => {
    console.log("useEffect", avatar, username)
    if (avatar && username) {
     navigate("/chat-bot")
    }
  }, [avatar, username])

  const handleUserName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserName(value)
    setUsernameError("")

    if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters long")
      return
    }

    try {
      // setIsCheckingUsername(true)
      console.log("value", value)
      
      const res = await axiosInstance.post(
        "/auth/check-username",
        { username: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log("res", res)
      if (res.status !== 200) {
        setUsernameError("Username is already taken")
      }
    } catch (error) {
      console.error("Error checking username:", error)
      setUsernameError("Error checking username availability")
    } finally {
      setIsCheckingUsername(false)
    }
  }

  const completeProfile = async () => {
    if (!avatarSelected && !userProfile.avatar) {
      toast({
        title: "Please select an avatar",
        variant: "destructive",
      })
      return
    }

    if (!userName && !userProfile.username) {
      toast({
        title: "Please enter a username",
        variant: "destructive",
      })
      return
    }

    if (usernameError) {
      toast({
        title: "Please fix username errors",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Add your profile completion logic here
      console.log("userProfile", avatarSelected, userName)
      const res = await axiosInstance.patch("/auth/update-profile", {
        avatar: avatarSelected,
        username: userName,
      },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if(res.status === 404) {
      toast({
        title: "Authentication error",
        description: "Redirecting to login page",
        variant: "destructive",
      })
      navigate("/")
      return;
    }
    if(res.status === 400) {
      toast({
        title: "Authentication error",
        description: "Redirecting to login page",
        variant: "destructive",
      })
      navigate("/")
      return;
    }
    if(res.status === 200) {
      toast({
        title: "Profile updated successfully",
      })
      dispatch(setUser({
        username: userName,
        avatar: avatarSelected as string, // provide a default value if avatarSelected is null
        email: email as string,
      }))
      return;
    }

     
    } catch (error) {
      console.error("Error completing profile:", error)
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-transparent border-none">
        <CardHeader>
          <CardTitle className="text-white text-xl">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {(!userProfile.avatar || userProfile.avatar === "" || userProfile.avatar === null) && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Choose your avatar</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {avatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => setAvatarSelected(avatar.name)}
                    className={`relative aspect-square rounded-full p-1 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      avatarSelected === avatar.name
                        ? "ring-2 ring-primary ring-offset-2 scale-105"
                        : "hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
                    }`}
                  >
                    <img
                      src={avatar.source || "/placeholder.svg"}
                      alt={`Avatar ${index + 1}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {(!userProfile.username || userProfile.username === "" || userProfile.avatar === null) && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={handleUserName}
                  className={usernameError ? "border-destructive text-white" : "text-white"}
                  disabled={isCheckingUsername}
                />
                {isCheckingUsername && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {usernameError && <p className="text-sm text-destructive">{usernameError}</p>}
            </div>
          )}

          <Button onClick={completeProfile} className="w-full bg-blue-700 text-white" disabled={isLoading || isCheckingUsername}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Profile
              </>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

