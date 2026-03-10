// @ts-nocheck
import kuaiShosignCore from './kuaiShoSignCore.js'
import crypto from 'crypto-js'
import qs from 'qs'

interface ISignParams {
  json: Record<string, any>
  type: 'form-data' | 'json'
  url: string
}

class KwaiSign {
  private exports: any = {}

  constructor() {
    const obj = { exports: {}, id: 75407, loaded: true }
    kuaiShosignCore[75407](obj)
    this.exports = obj.exports
  }

  sign(params: ISignParams): Promise<string> {
    return new Promise((resolve, reject) => {
      const { url } = params
      const md5 = this.md5(params)

      this.exports.realm.global['$encode'](md5, {
        suc(s: string) {
          resolve(`${url}?__NS_sig3=${s}`)
        },
        err(e: string) {
          reject(new Error(`签名失败: ${e}`))
        },
      })
    })
  }

  private md5({ json, type }: ISignParams): string {
    const str = type === 'form-data' ? qs.stringify(json) : JSON.stringify(json)
    return crypto.MD5(str).toString()
  }
}

const kwaiSign = new KwaiSign()
export default kwaiSign
