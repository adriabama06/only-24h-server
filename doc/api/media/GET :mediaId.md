# /:mediaId
**Full URL:** /api/media/:mediaId *(Ex: /api/media/650f159f89e9a8c321b535f9)*  
**HTTP Method:** GET  
## Request:
Empty
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
        comments: [],
        createdAt: '2023-09-30T18:44:18.634Z',
        expirationDate: '2023-10-01T18:44:18.634Z',
        updatedAt: "2023-09-23T16:43:11.214Z",
        id: "650f159f89e9a8c321b535f9"
    }
}
```