# /search
**Full URL:** /api/media/search  
**HTTP Method:** GET  
## Request:
### Query:
```ts
q=my dog
```

## Response **200**:
```ts
{
    error: null,
    data: [
        {
            filename: "mydog.png",
            title: "Me with my dog",
            subtitle: "This is my photo of me with my dog in my house",
            author: "650f135089e9a8c321b535f4",
            likes: [],
            comments: [],
            createdAt: '2023-09-30T18:44:18.634Z',
            expirationDate: '2023-10-01T18:44:18.634Z',
            updatedAt: "2023-09-23T17:51:21.417Z",
            id: "650f2599fba7d8242cf961ff"
        }
    ]
}
```