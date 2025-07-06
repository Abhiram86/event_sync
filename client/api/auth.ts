const base_url = "http://192.168.1.6:8080/graphql";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export const register = async (data: RegisterBody) => {
  const query = `
        mutation RegisterUser($name: String!, $email: String!, $password: String!) {
            register(name: $name, email: $email, password: $password) {
                token
                user {
                    id
                    name
                    email
                }
            }
        }
    `;
  const variables = {
    name: data.name,
    email: data.email,
    password: data.password,
  };
  try {
    const response = await fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    if (result.errors) {
      return {
        data: null,
        error: result.errors[0].message,
      };
    }
    return {
      data: result.data,
      error: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        data: null,
        error: error.message,
      };
    }
    return {
      data: null,
      error: "An error occurred",
    };
  }
};

export const login = async (data: Omit<RegisterBody, "name">) => {
  const query = `
        mutation LoginUser($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                token
                user {
                    id
                    name
                    email
                }
            }
        }
    `;
  const variables = {
    email: data.email,
    password: data.password,
  };
  try {
    const response = await fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    if (result.errors) {
      return {
        data: null,
        error: result.errors[0].message,
      };
    }
    return {
      data: result.data,
      error: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        data: null,
        error: error.message,
      };
    }
    return {
      data: null,
      error: "An error occurred",
    };
  }
};

export const me = async (token: string) => {
  const query = `
        query Me {
            me {
                id
                name
                email
            }
        }
    `;
  try {
    const response = await fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    if (result.errors) {
      return {
        data: null,
        error: result.errors[0].message,
      };
    }
    return {
      data: result.data,
      error: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        data: null,
        error: error.message,
      };
    }
    return {
      data: null,
      error: "An error occurred",
    };
  }
};
