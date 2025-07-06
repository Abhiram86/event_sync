import { getToken } from "@/utils/SecureStore";

const base_url = "http://192.168.1.6:8080/graphql";

export const getEvents = async () => {
  const token = await getToken();
  const query = `
        query GetEvents {
            events {
                id
                name
                location
                startTime
                createdAt
                updatedAt
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
    return {
      data: null,
      error: (error as Error).message,
    };
  }
};

export const getEvent = async (id: string) => {
  const token = await getToken();
  const query = `
        query GetEvent($id: ID!) {
            event(id: $id) {
                name
                location
                startTime
                attendees {
                    id
                    name
                }
            }
        }
    `;
  const variables = {
    id,
  };
  try {
    const response = await fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    return {
      data: null,
      error: (error as Error).message,
    };
  }
};

export const joinEvent = async (id: string) => {
  const token = await getToken();
  const query = `
        mutation JoinEvent($id: ID!) {
            joinEvent(eventId: $id) {
              id
            }
        }
    `;
  const variables = {
    id,
  };
  try {
    const response = await fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    return {
      data: null,
      error: (error as Error).message,
    };
  }
};

export const leaveEvent = async (id: string) => {
  const token = await getToken();
  const query = `
        mutation LeaveEvent($id: ID!) {
            leaveEvent(eventId: $id) {
              id
            }
        }
    `;
  const variables = {
    id,
  };
  try {
    const response = await fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    return {
      data: null,
      error: (error as Error).message,
    };
  }
};
