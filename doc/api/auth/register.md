# /register
**Full URL:** /api/auth/register  
**HTTP Method:** POST  
## Request:
### Headers:
```ts
Content-Type: application/json; charset=utf-8
```

### Body:
```ts
{
    username: "username"
    email: "username@mail.com"
    password: "123456"
}
```

## Response **200**:
```ts
{
    error: false,
    data: {
        username: "username",
        password: "ENCRYPTEDPASSWORD",
        email: "username@mail.com",
        date: "2023-09-23T16:33:20.485Z",
        createdAt: "2023-09-23T16:33:20.501Z",
        updatedAt: "2023-09-23T16:33:20.501Z",
        id: "650f135089e9a8c321b535f4"
  }
}
```