export async function isNewUser(token, issuer) {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        id
        email
        issuer
      }
    }
`;
  const response = await queryHasuraGQL(operationsDoc, "isNewUser", { issuer }, token);
  return response?.data?.users?.length === 0;
}

export async function createNewUser(token, metadata, dateString) {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!, $dateString: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress, registerDate: $dateString}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;

  const { issuer, email, publicAddress } = metadata;
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress,
      dateString,
    },
    token
  );
  return response;
}

export async function getUserDetailsQuery(token, issuer) {
  const operationsDoc = `
  query getUserDetails($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      displayName,
      profilePic, 
      email,
      issuer,
      admin,
      testimonial,
      paidPlan,
      planExpireDate,
      subscribedIn,
      registerDate,
      secretKeyword,
      cropArea
      privacy
      links
      description
      gallery
    }
  }
`;
  const response = await queryHasuraGQL(operationsDoc, "getUserDetails", { issuer }, token);
  return response;
}

export async function getProfileDetailsQuery(token, displayName) {
  const operationsDoc = `
  query getProfileDetails($displayName: String!) {
    users(where: {displayName: {_eq: $displayName}}) {
      displayName
      profilePic,
      email
      testimonial
      registerDate
      cropArea
      issuer
      privacy
      links
      description
      gallery
      paidPlan
      planExpireDate
      subscribedIn
    }
  }
`;
  const response = await queryHasuraGQL(operationsDoc, "getProfileDetails", { displayName }, token);
  return response;
}

export async function getProfileDetailsByIssuerQuery(token, issuer) {
  const operationsDoc = `
  query getProfileDetailsByIssuer($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      displayName,
      profilePic, 
      email,
      testimonial,
      registerDate,
      cropArea,
      issuer
    }
  }
`;
  const response = await queryHasuraGQL(
    operationsDoc,
    "getProfileDetailsByIssuer",
    { issuer },
    token
  );
  return response;
}

export async function addPurchaseQuery(
  token,
  issuer,
  planName,
  planPrice,
  paymentId,
  email,
  date,
  forUser
) {
  const operationsDoc = `
  mutation addPurchase($issuer: String!, $planName: String!, $planPrice: Float!, $paymentId: String!, $email: String!, $date: String!, $forUser: String!) {
    insert_purchases(objects: {issuer: $issuer, planName: $planName, planPrice: $planPrice, paymentId: $paymentId, email: $email, date: $date, forUser: $forUser}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "addPurchase",
    {
      issuer,
      planName,
      planPrice,
      paymentId,
      email,
      date,
      forUser,
    },
    token
  );

  return response;
}

export async function updateSubscription(token, issuer, paidPlan, planExpireDate, subscribedIn) {
  const operationsDoc = `
  mutation update_subscription($issuer: String!, $paidPlan: String!, $planExpireDate: Int!, $subscribedIn: Int!) {
    update_users(where: {issuer: {_eq: $issuer}}, _set: {paidPlan: $paidPlan, planExpireDate: $planExpireDate, subscribedIn: $subscribedIn}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "update_subscription",
    {
      issuer,
      paidPlan,
      planExpireDate,
      subscribedIn,
    },
    token
  );

  return response;
}

export async function SetKeywordQuery(token, issuer, secretKeyword) {
  const operationsDoc = `
  mutation update_subscription($issuer: String!, $secretKeyword: String!) {
    update_users(where: {issuer: {_eq: $issuer}}, _set: {secretKeyword: $secretKeyword}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "update_subscription",
    {
      issuer,
      secretKeyword,
    },
    token
  );

  return response;
}

export async function ChangeDisplayNameQuery(token, issuer, displayName) {
  const operationsDoc = `
  mutation changeDisplayName($issuer: String!, $displayName: String!) {
    update_users(where: {
        issuer: {_eq: $issuer},
      }, 
      _set: {displayName: $displayName}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "changeDisplayName",
    {
      issuer,
      displayName,
    },
    token
  );

  return response;
}

export async function ChangeSecretKeywordQuery(token, issuer, newSecretKeyword) {
  const operationsDoc = `
  mutation changeSecretKeyword($issuer: String!, $newSecretKeyword: String!) {
    update_users(where: {
        issuer: {_eq: $issuer},
      }, 
      _set: {secretKeyword: $newSecretKeyword}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "changeSecretKeyword",
    {
      issuer,
      newSecretKeyword,
    },
    token
  );

  return response;
}

export async function checkDisplayNameQuery(token, displayName) {
  const operationsDoc = `
    query checkDisplayName($displayName: String!) {
      users(where: {displayName: {_eq: $displayName}}) {
        id
      }
    }
`;
  const response = await queryHasuraGQL(operationsDoc, "checkDisplayName", { displayName }, token);

  return response?.data?.users?.length;
}

export async function changeNewProfilePicQuery(token, displayName, profilePic, issuer) {
  const operationsDoc = `
  mutation newProfilePic($displayName: String!, $profilePic: String!, $issuer: String!) {
    update_users(where: {
        displayName: {_eq: $displayName},
        issuer: {_eq: $issuer}
      }, 
      _set: {profilePic: $profilePic}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "newProfilePic",
    {
      displayName,
      profilePic,
      issuer,
    },
    token
  );
  return response;
}

export async function SetCroppedAreaQuery(token, displayName, cropArea) {
  const operationsDoc = `
  mutation updateCropArea($displayName: String!, $cropArea: String!) {
    update_users(where: {displayName: {_eq: $displayName}}, _set: {cropArea: $cropArea}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "updateCropArea",
    {
      displayName,
      cropArea,
    },
    token
  );

  return response;
}

export async function addTestimonialQuery(
  token,
  displayName,
  date,
  text,
  rating,
  issuer,
  profilePic
) {
  const operationsDoc = `
  mutation addTestimonial($displayName: String!, $date: String!, $text: String!, $rating: Float!, $issuer: String!, $profilePic: String!) {
    insert_testimonials(objects: {name: $displayName, date: $date, text: $text, rating: $rating, issuer: $issuer, profilePic: $profilePic}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "addTestimonial",
    {
      displayName,
      date,
      text,
      rating,
      issuer,
      profilePic,
    },
    token
  );

  return response;
}

export async function getTestimonialsQuery(token) {
  const operationsDoc = `
  query getTestimonials {
    testimonials {
      date
      id
      issuer
      name
      rating
      text
      profilePic
    }
  }
`;

  const response = await queryHasuraGQL(operationsDoc, "getTestimonials", {}, token);

  return response;
}

export async function getNewsQuery(token) {
  const operationsDoc = `
  query getNews {
    news {
      ID
      Title
      Image
      Content
      Date
      Views
    }
  }
`;

  const response = await queryHasuraGQL(operationsDoc, "getNews", {}, token);

  return response;
}

export async function getUsersDisplayName(token) {
  const operationsDoc = `
  query getUsersName {
    users {
      displayName
    }
  }
`;

  const response = await queryHasuraGQL(operationsDoc, "getUsersName", {}, token);

  return response;
}

export async function getNewsByIdQuery(token, id) {
  const operationsDoc = `
    query getNewsById($id: Int!) {
      news(where: {ID: {_eq: $id}}) {
        ID
        Date
        Content
        Image
        Title
        Views
      }
    }
`;
  const response = await queryHasuraGQL(operationsDoc, "getNewsById", { id }, token);

  return response;
}

export async function getNewsByNameQuery(token, name) {
  const operationsDoc = `
    query getNewsByName($name: String!) {
      news(where: {Title: {_iregex: $name}}) {
        ID
        Date
        Content
        Image
        Title
        Views
      }
    }
`;
  const response = await queryHasuraGQL(operationsDoc, "getNewsByName", { name }, token);

  return response;
}

export async function getPopularNewsQuery(token) {
  const operationsDoc = `
  query getPopularNews {
    news(order_by: {Views: desc}, limit: 5) {
      ID
      Title
      Image
      Content
      Date
      Views
    }
  }
`;

  const response = await queryHasuraGQL(operationsDoc, "getPopularNews", {}, token);

  return response;
}

export async function increaseViewsForPostQuery(token, id, views) {
  const operationsDoc = `
  mutation increaseViews($id: Int!, $views: Int!) {
    update_news(where: {ID: {_eq: $id}}, _set: {Views: $views}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "increaseViews",
    {
      id,
      views,
    },
    token
  );

  return response;
}

export async function updateTestimonialQuery(token, date, text, rating, issuer) {
  const operationsDoc = `
  mutation updateTestimonial($date: String!, $text: String!, $rating: Float!, $issuer: String!) {
    update_testimonials(where: {issuer: {_eq: $issuer}}, _set: {text: $text, rating: $rating, date: $date}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "updateTestimonial",
    {
      date,
      text,
      rating,
      issuer,
    },
    token
  );

  return response;
}

export async function addTestimonialToUserQuery(token, issuer) {
  const operationsDoc = `
  mutation update_testimonial($issuer: String!) {
    update_users(where: {issuer: {_eq: $issuer}}, _set: {testimonial: true}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "update_testimonial",
    {
      issuer,
    },
    token
  );

  return response;
}

export async function postNewsQuery(token, title, text, img, date) {
  const operationsDoc = `
  mutation post_news($title: String!, $img: String! $text: String!, $date: String!) {
    insert_news(objects: {Title: $title, Image: $img, Content: $text, Date: $date}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "post_news",
    {
      title,
      text,
      img,
      date,
    },
    token
  );

  return response;
}

export async function forgotKeywordQuery(token, email) {
  const operationsDoc = `
  query forgotKeyword($email: String!) {
    users(where: {email: {_eq: $email}}) {
      displayName,
      email,
      issuer,
    }
  }
`;
  const response = await queryHasuraGQL(operationsDoc, "forgotKeyword", { email }, token);
  return response;
}

export async function getUsersQuery(token) {
  const operationsDoc = `
   query getUsers {
    users {
      admin
      cropArea
      displayName
      email
      id
      issuer
      paidPlan
      planExpireDate
      profilePic
      publicAddress
      registerDate
      secretKeyword
      subscribedIn
      testimonial
    }
  }
`;
  const response = await queryHasuraGQL(operationsDoc, "getUsers", {}, token);
  return response;
}

export async function setSecretKeywordNULLQuery(token, issuer) {
  const operationsDoc = `
  mutation setSecretKeywordNull($issuer: String!) {
    update_users(where: {issuer: {_eq: $issuer}}, _set: {secretKeyword: NULL}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "setSecretKeywordNull",
    {
      issuer,
    },
    token
  );

  return response;
}

export async function updatePrivacyQuery(token, issuer, privacy) {
  const operationsDoc = `
  mutation updatePrivacy($issuer: String!, $privacy: String!) {
    update_users(where: {issuer: {_eq: $issuer}}, _set: {privacy: $privacy}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "updatePrivacy",
    {
      issuer,
      privacy,
    },
    token
  );

  return response;
}

export async function updateLinksQuery(token, issuer, links) {
  const operationsDoc = `
  mutation updateLinks($issuer: String!, $links: String!) {
    update_users(where: {issuer: {_eq: $issuer}}, _set: {links: $links}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "updateLinks",
    {
      issuer,
      links,
    },
    token
  );

  return response;
}

export async function updateDescriptionQuery(token, issuer, description) {
  const operationsDoc = `
  mutation updateDescription($issuer: String!, $description: String!) {
    update_users(where: {issuer: {_eq: $issuer}}, _set: {description: $description}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "updateDescription",
    {
      issuer,
      description,
    },
    token
  );

  return response;
}

export async function updateGalleryQuery(token, issuer, gallery) {
  const operationsDoc = `
  mutation updateGallery($issuer: String!, $gallery: String!) {
    update_users(where: {issuer: {_eq: $issuer}}, _set: {gallery: $gallery}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "updateGallery",
    {
      issuer,
      gallery,
    },
    token
  );

  return response;
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_HASURA_ADMIN_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}
