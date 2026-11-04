"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getFileList } from "@/lib/api"

interface LinkInputProps {
  onSubmit: (link: string, files: Array<{ key: string; name: string }>) => void
  password: string
}

export function LinkInput({ onSubmit, password }: LinkInputProps) {
  const [link, setLink] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!link.trim()) {
      setError("请输入城通网盘链接")
      return
    }

    // 检查链接格式并提取 xtlink
    let xtlink = link.trim()
    if (xtlink.startsWith("ctfile://")) {
      xtlink = xtlink.substring(9)
    }

    try {
      setIsLoading(true)
      setError(null)

      const files = await getFileList(xtlink, password)

      if (files && files.length > 0) {
        onSubmit(xtlink, files)
      } else {
        setError("未找到文件或链接无效")
      }
    } catch (err: any) {
      setError(`获取文件列表失败: ${err.message || '请检查链接是否正确'}`)
      console.error("获取文件列表时出错:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">输入城通网盘链接</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="link">链接</Label>
          <Input
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="请输入城通网盘链接，例如: ctfile://xxxxxx"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">支持格式: ctfile://xxxxxx 或直接输入 xxxxxx</p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "解析中..." : "解析链接"}
        </Button>
      </form>
    </div>
  )
}
