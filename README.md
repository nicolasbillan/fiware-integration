# Google Vision Api & Sendgrid

- Process image from url
[/api/vision/image]
```
body:
{
    "url": "[image_url]",
}
```
- Process image from local file
[/api/vision/image/<id>]
```
id = image_name
```
- Sending mail with ticket attached
[/api/vision/email]
```
body:
{
    "email": "[email]",
    "image": "[image_name].[extension]"
}
```