# Servo

An image resizing service to sit **behind** a dynamic cache (like CloudFront).

## Install

Install Servo with npm.

```bash
npm install -g servo
```

Set up your configuration (see below) and simply run

```bash
servo path/to/config
```

## Config

Servo uses a JS/JSON file for configuration. By default, Servo will look for
`process.cwd() + '/servo', but you can specifiy another location by passing
it as the first argument to the executable.

**sample servo.json**
```json
{
  // The port servo will listen for requests on.
  "port": 80,

  // Headers that will be appended on GET responses and also on PUT requests to
  // the S3 bucket.
  "headers": {
    "Cache-Control": "max-age=315360000",
    "x-amz-acl": "public-read"
  },

  // Hosts that point to the cloudfront endpoint. Requests on servo that are not
  // from cloudfront will be redirected randomly to one of these hosts.

  "hosts": [
    "cdn0.example.com",
    "cdn1.example.com",
    "cdn2.example.com",
    "cdn3.example.com"
  ],

  // A whitelist of coercible extensions.
  "extensions": [
    "jpg",
    "png",
    "gif",
    "css",
    "js"
  ],

  // The S3 bucket to be used.
  "bucket": "some-s3-bucket",

  // AWS Access Key ID.
  "accessKeyId": "XXX",

  // AWS Secret Access Key.
  "secretAccessKey": "XXX",

  // A shared key between servo and a publishing app.
  "apiKey": "XXX",

  // GraphicsMagick routines to put an image through when specified in the URL.
  "routines": {
    "profile": "scale:200,200,^;gravity:Center;extent:200,200;strip",
    "100x100": "resize:100,100;strip"
  }
}
```

## Requests

Servo responds to a few requests.

---

**request**
```
GET /path/to/resource[-size][.extension]
```

No authentication is required for this request. If specific image at the
requested size and extension has yet to be generated, it will be generated on
the fly, otherwise the cloudfront cache should catch it.

**response**
```
(requested resource or empty body and error status code)
```

---

**request**
```
PUT /[explicit route]
X-Api-Key: XXX

file=@imgA.jpg OR path=/s3path
routine=strip;scale:100,100;... (optional)
...
```

An API Key is required in the header of the request to PUT resources into S3.
When an explicit route is not specified, files are saved as their MD5 value. The
resource mime type is extracted from the file's extension and stored as a header
in S3. An optional `routine` option may be added to put the image through a
series of GraphicsMagick operations before uploading.

**response**
```json
{
  "path": "/md5hashorexplicitroute...",
  "size": 1234,
  "type": "image/jpeg",
  "width": 100,
  "height": 200
}
```

---

**request**
```
DELETE /path/to/resource
X-Api-Key: XXX
```

An API Key is required in the header of the request to DELETE resources in S3. The request simply returns a 200 status and empty JSON object on success.

**response**
```json
{}
```
