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
    data: [
        {
            id: "9264c85b060169defe6fac46a04042ce",
            author: "650f135089e9a8c321b535f4",
            content: "wow, your dog is very cute",
            createdAt: "2023-09-24T10:37:18.917Z"
        }
    ]
}
```