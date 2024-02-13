const api = {
    get: (endpoint: string) => fetch(`${SERVER_BASE}/${endpoint}`),
    post: (endpoint: string, body: any) =>
        fetch(`${SERVER_BASE}/${endpoint}`, {
            method: "POST",
            body: body && JSON.stringify(body)
        }),
    put: (endpoint: string, body: any) =>
        fetch(`${SERVER_BASE}/${endpoint}`, {
            method: "PUT",
            body: body && JSON.stringify(body)
        }),
    delete: (endpoint: string) =>
        fetch(`${SERVER_BASE}/${endpoint}`, {
            method: "DELETE"
        })
};

export { api };