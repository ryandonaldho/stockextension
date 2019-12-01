class EasyHTTP {
  // Make an HTTP GET Request
  async get(url) {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  }

  // Make an HTTP Post Request
  async post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const resData = await response.json();
    return resData;
  }

  // Make an HTTP PUT request
  async put(url, data) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const resData = await response.json();
    return resData;
  }

  // Make an HTTP Delete Request
  async delete(url) {
    const response = fetch(url, {
      method: "delete",
      headers: {
        "Content-type": "application/json"
      }
    });
    const resData = await response;
    if (resData.ok) {
      return "Resource Deleted";
    } else {
      return "Error";
    }
  }
}

export const http = new EasyHTTP();
