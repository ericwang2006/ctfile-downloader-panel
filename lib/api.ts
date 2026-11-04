// "use server"

// 动态获取 API 地址：优先使用配置的 NEXT_PUBLIC_API_URL；
// 若环境变量未配置、包含占位符、或指向 localhost 但当前从外部 IP 访问时，自动使用当前页面的 hostname:8787
export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== "undefined") {
    if (
      !envUrl ||
      envUrl.includes("__API_URL_PLACEHOLDER__") ||
      (envUrl.includes("localhost") &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1")
    ) {
      return `${window.location.protocol}//${window.location.hostname}:8787`
    }
  }
  return envUrl || "http://localhost:8787"
}

// 检查是否已登录（无密码保护时直接返回 true）
export async function checkLogin(): Promise<boolean> {
  try {
    const apiUrl = getApiUrl()
    const response = await fetch(`${apiUrl}/login`, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      return false
    }

    const text = (await response.text()).trim()
    return text === "true" || text === "true\n" || text === '"true"'
  } catch (error) {
    console.error("检查登录状态时出错:", error)
    return false
  }
}

// 验证密码
export async function verifyPassword(password: string): Promise<boolean> {
  const apiUrl = getApiUrl()
  const cleanPassword = password.trim()
  const response = await fetch(
    `${apiUrl}/login?password=${encodeURIComponent(cleanPassword)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const text = (await response.text()).trim()
  return text === "true" || text === "true\n" || text === '"true"'
}

// 获取文件列表
export async function getFileList(
  xtlink: string,
  password: string
): Promise<Array<{ key: string; name: string }>> {
  const apiUrl = getApiUrl()
  let url = `${apiUrl}/download_info?xtlink=${encodeURIComponent(xtlink)}`

  if (password) {
    url += `&password=${encodeURIComponent(password.trim())}`
  }

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  })

  if (!response.ok) {
    let errMessage = `API 请求失败: ${response.status}`
    try {
      const errJson = await response.json()
      if (errJson?.error) errMessage = errJson.error
    } catch {}
    throw new Error(errMessage)
  }

  return await response.json()
}
