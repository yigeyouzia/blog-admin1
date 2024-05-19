import axios from "axios";
import { ElLoading } from 'element-plus'
import router from '@/router'
import message from "./Message";



// application/x-www-form-urlencoded
const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json"
const contentTypeFile = "multipart/form-data"
// axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";

const request = (config) => {
    let { url, parmas, dataType = 'form', showLoading = 'true' } = config
    // dataType = dataType ? dataType : "form"  // 默认表单
    // showLoading = showLoading ? showLoading : true

    let contentType = contentTypeForm
    if (dataType === "json") {
        contentType = contentTypeJson
    } else if (dataType === "file") {
        // 处理文件上传
        contentType = contentTypeFile
        let parma = new FormData()
        for (let key in parmas) {
            parma.append(key, parmas[key])
        }
        parmas = parma
    }

    console.log(dataType)
    const instance = axios.create({
        baseURL: '/api',
        timeout: 10 * 1000, // 10秒 
        headers: {
            'Content-Type': contentType,
            'X-Requested-With': 'XMLHttpRequest'
        },
    })

    // 请求前拦截
    let loading = null
    instance.interceptors.request.use(
        config => {
            if (showLoading) {
                // loading加载
                loading = ElLoading.service({
                    lock: true,
                    text: 'Loading......',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
            }
            return config
        },
        error => {
            if (showLoading && loading) {
                loading.close();
            }
            // Message消息提示
            message.error("发送请求失败")
            return Promise.reject("发送请求失败")
        }
    );

    // 请求后拦截
    instance.interceptors.response.use(
        (response) => {
            if (showLoading && loading) {
                loading.close();
            }
            const responseData = response.data
            if (responseData.status == "error") {
                if (config.errorCallback) {
                    config.errorCallback()
                }
                return Promise.reject(responseData.info)
            } else {
                if (responseData.code == 200) {
                    return responseData
                } else if (responseData.code == 901) {
                    setTimeout(() => {
                        router.push("/login")
                    }, 2000)
                    return Promise.reject("登录超时")
                }
            }
        },
        error => {
            console.log(error)
            if (showLoading && loading) {
                loading.close();
            }
            return Promise.reject("网络异常1")
        }
    )

    return instance.post(url, parmas).catch(error => {
        message.error(error)
        return null;
    })

    /* let result = new Promise((resolve, reject) => {
        instance.post(url, parmas).then(res => {
            resolve(res)
        }).catch(error => {
            message.error(error)
        })
    })
    return result */
}
export default request