import StripeCheckout from "react-stripe-checkout";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../redux/user.slice";
import { setSubscriptionState } from "../../redux/subscription.slice";
import { setDialog } from "../../redux/dialog.slice";
import { setSnackbar } from "../../redux/snackbar.slice";
import fetchData from "../../utils/fetchData";
import { setOtherState } from "../../redux/others.slice";
import firebase from "../../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

type IStripeButton = {
  price?: any;
  period?: string;
};

const StripeCheckoutButton = ({ price, period }: IStripeButton) => {
  const priceForStripe = price * 100.00002;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_API_PUBLISHABLE_KEY;
  const correctPeriod = period === "year" ? 365 : period === "month" ? 30 : 7;

  const firestore = firebase.firestore();
  const notificationsRef = firestore.collection("notifications");
  const queryQ = notificationsRef.orderBy("createdAt", "desc");
  //@ts-ignore
  const [notifications] = useCollectionData(queryQ, { id: "id" });

  const userRedux = useSelector((state: any) => state.user.user);
  const otherRedux = useSelector((state: any) => state.other.other);
  const subscription = useSelector((state: any) => state.subscription.subscription);
  const dispatch = useDispatch();

  const finalPrice = (priceForStripe / 100).toFixed(2);

  const onToken = async (token: any) => {
    let d = new Date();
    const currentMonth = d.getMonth();
    const currentDay = d.getDate();
    const currentYear = d.getFullYear();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const initialDate = Math.floor(Date.now() / 1000 + correctPeriod * 24 * 60 * 60);
    const difference = userRedux.planExpireDate - Date.now() / 1000;
    const expireDate =
      userRedux.planExpireDate === 0 ? Math.floor(initialDate) : initialDate + difference;
    dispatch(
      setSnackbar({
        open: true,
        content: `Payment Successful! You have just bought a ${
          subscription.plan
        }ly subscription for ${
          otherRedux.userSelectedForGift.issuerForGift === ""
            ? `$${subscription.price}. You may now use the exercise page.`
            : `${otherRedux.userSelectedForGift.nameForGift} at the price of $${subscription.price}`
        }`,
      })
    );

    dispatch(setDialog(false));
    dispatch(
      setSubscriptionState({
        price: 0,
        plan: "",
      })
    );
    const dateString = `${months[currentMonth]}-${currentDay}-${currentYear}`;

    await fetchData(`${process.env.NEXT_PUBLIC_FETCH_ADD_PURCHASE}`, {
      method: "POST",
      headers: {
        body: JSON.stringify({
          issuer: userRedux.issuer,
          planName: period,
          planPrice: finalPrice,
          paymentId: token.id,
          email: userRedux.email,
          date: dateString,
          forUser:
            otherRedux.userSelectedForGift.issuerForGift === ""
              ? userRedux.issuer
              : otherRedux.userSelectedForGift.issuerForGift,
        }),
      },
    });

    if (otherRedux.userSelectedForGift.issuerForGift !== "") {
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_SEND_MAIL}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            type: "gift",
            email: userRedux.email,
            subject: `A gift for ${otherRedux.userSelectedForGift.nameForGift}!`,
            message: `
              <div
                style="background: #140630; border-radius: 20px; color: #DC82F2; padding: 1rem; font-family: 'Kodchasan', sans-serif;">
                <div style="display: flex; justify-content: center; align-items: center;">
                    <img src="https://res.cloudinary.com/dgkdpysp5/image/upload/v1682434325/logo-gym_k9lpki.png"
                        style="width: 50px; height: 50px;" alt="Logo" />
                    <h2 style="color: #DC82F2;">GYM-EXPERT</h2>
                </div>

                <h4 style="font-weight: 100;">Your gift has been successfully sent to ${otherRedux.userSelectedForGift.nameForGift}. \r\nNOTE: You have received this e-mail because you sent a gift to someone.</h4>
                <h4 style="font-weight: 100;">Summary:\r\nPayment ID: ${token.id}\r\nPlan: ${period}\r\nPrice: $${finalPrice}</h4>
                <h4 style="font-weight: 100;">Best wishes,\r\nGym-Expert Team</h4>
              </div>
            `,
          }),
        },
      });

      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_SEND_MAIL}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            type: "gift",
            email: otherRedux.userSelectedForGift.emailForGift,
            subject: `A gift from ${userRedux.displayName}!`,
            message: `
              <div
                style="background: #140630; border-radius: 20px; color: #DC82F2; padding: 1rem; font-family: 'Kodchasan', sans-serif;">
                <div style="display: flex; justify-content: center; align-items: center;">
                    <img src="https://res.cloudinary.com/dgkdpysp5/image/upload/v1682434325/logo-gym_k9lpki.png"
                        style="width: 50px; height: 50px;" alt="Logo" />
                    <h2 style="color: #DC82F2;">GYM-EXPERT</h2>
                </div>

                <h4 style="font-weight: 100;">${userRedux.displayName} has sent you a ${period}ly subscription. You have received this e-mail because a gift has been sent to you. You can claim it visiting our platform and click on the notifications bell.</h4>
                <h4 style="font-weight: 100;">Best wishes,\r\nGym-Expert Team</h4>
              </div>
            `,
          }),
        },
      });
    } else {
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_SEND_MAIL}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            type: "gift",
            email: userRedux.email,
            subject: `Your ${period}ly subscription on Gym-Expert`,
            message: `
              <div
                style="background: #140630; border-radius: 20px; color: #DC82F2; padding: 1rem; font-family: 'Kodchasan', sans-serif;">
                <div style="display: flex; justify-content: center; align-items: center;">
                    <img src="https://res.cloudinary.com/dgkdpysp5/image/upload/v1682434325/logo-gym_k9lpki.png"
                        style="width: 50px; height: 50px;" alt="Logo" />
                    <h2 style="color: #DC82F2;">GYM-EXPERT</h2>
                </div>

                <h4 style="font-weight: 100;">Thank you for purchasing a subscription on our platform. \r\nNOTE: You have received this e-mail because you purchased a subscription on Gym-Expert.</h4>
                <h4 style="font-weight: 100;">Summary:\r\nPayment ID: ${token.id}\r\nPlan: ${period}\r\nPrice: $${finalPrice}</h4>
                <h4 style="font-weight: 100;">If you ever have any issues, please feel free to contact us.</h4>
                <h4 style="font-weight: 100;">Best wishes,\r\nGym-Expert Team</h4>
              </div>
            `,
          }),
        },
      });
    }

    if (otherRedux.userSelectedForGift.issuerForGift === "") {
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_UPDATE_SUBSCRIPTION}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            planExpireDate: Math.round(expireDate),
            paidPlan: period,
            subscribedIn: initialDate,
          }),
        },
      });

      dispatch(
        setUserState({
          ...userRedux,
          paidPlan: period,
          planExpireDate: Math.round(expireDate),
          subscribedSince: Math.floor(Date.now() / 1000),
        })
      );
    }

    {
      notifications &&
        (await notificationsRef.add({
          id: notifications.length + 1,
          content: `${userRedux.displayName} has gifted you a ${period}ly subscription. Click on the button below to receive your gift.`,
          forUser: otherRedux.userSelectedForGift.issuerForGift,
          read: false,
          sender: userRedux.displayName,
          senderIssuer: userRedux.issuer,
          title: `${userRedux.displayName} has sent you a gift.`,
          type: "gift",
          clickableLink: `Click to receive your ${period}ly subscription`,
          gift: {
            period: period,
          },
          receivedGift: false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          responded: true,

          // we need: correctPeriod, initialDate, expireDate, difference
        }));
    }

    dispatch(
      setOtherState({
        ...otherRedux,
        userSelectedForGift: {
          issuerForGift: "",
          nameForGift: "",
          paidPlan: null,
          planExpireDate: 0,
        },
      })
    );
  };

  return (
    <StripeCheckout
      label="Pay Now"
      name="GYM"
      billingAddress
      shippingAddress
      image="https://p.kindpng.com/picc/s/45-451836_transparent-king-crown-clipart-king-crown-clipart-hd.png"
      description={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel="Pay Now"
      token={onToken}
      stripeKey={publishableKey}
    />
  );
};

export default StripeCheckoutButton;
