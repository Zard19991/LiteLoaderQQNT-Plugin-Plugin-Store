/*
 * @Date: 2024-01-22 16:57:38
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-22 17:45:24
 */
async function measureSpeed(urls) {
    const requests = urls.map(async (url) => {
      const start = performance.now();
      try {
        const response = await fetch(`${url}https://raw.githubusercontent.com/LiteLoaderQQNT/Plugin-List/v4/plugins.json`);
        const data = await response.json();
        const end = performance.now();
        return { url, responseTime: end - start, data: data };
      } catch (error) {
        return { url, responseTime: Infinity };
      }
    });
  
    const results = await Promise.all(requests);

    // 找到最快的响应时间
    const fastest = results.reduce((min, result) => {
      return result.responseTime < min.responseTime ? result : min;
    }, { responseTime: Infinity });
  
    return fastest;
}

export {
    measureSpeed
}