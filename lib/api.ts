// "use server"

// 获取环境变量
const API_URL = process.env.NEXT_PUBLIC_API_URL

// 检查是否已登录
export async function checkLogin(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("检查登录状态时出错:", error)
    return false
  }
}

// 验证密码
export async function verifyPassword(password: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/login?password=${encodeURIComponent(password)}`, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("验证密码时出错:", error)
    return false
  }
}

// 获取文件列表
export async function getFileList(xtlink: string, password: string): Promise<Array<{ key: string; name: string }>> {
  try {
    let url = `${API_URL}/download_info?xtlink=${encodeURIComponent(xtlink)}`

    if (password) {
      url += `&password=${encodeURIComponent(password)}`
    }

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取文件列表时出错:", error)
    return []
  }
}
