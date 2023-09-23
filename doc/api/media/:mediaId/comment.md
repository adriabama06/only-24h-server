# /comment
**Full URL:** /api/media/:mediaId/comment *(Ex: /api/media/650f159f89e9a8c321b535f9/comment)*  
**HTTP Method:** POST  
## Request:
### Headers:
```ts
auth-token: "1b54bf1f92182e4e3646277083a39b96"
Content-Type: application/json; charset=utf-8
```

### Body:
```ts
{
    content: "wow, your dog is very cute"
}
```

## Response **200**:
```ts
{
    error: false,
    data: {
        filename: "mydog.png",
        title: "Me with my dog",
        subtitle: "This is my photo of me with my dog in my house",
        author: "650f135089e9a8c321b535f4",
        likes: [],
        comments: [
            {
                id: "8d15b96cf5a2c1381fb370f23d21c1bf",
                author: "650f135089e9a8c321b535f4",
                content: "wow, your dog is very cute",
                createdAt: "2023-09-23T17:29:37.986Z"
            }
        ],
        deleteAfter: 86400000,
        createdAt: "2023-09-23T16:43:11.214Z",
        updatedAt: "2023-09-23T16:43:11.214Z",
        id: "650f159f89e9a8c321b535f9"
    }
}
```