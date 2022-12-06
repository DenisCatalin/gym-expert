import StripeCheckout from "react-stripe-checkout";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../redux/user.slice";
import { setSubscriptionState } from "../../redux/subscription.slice";
import { setDialog } from "../../redux/dialog.slice";
import { setSnackbar } from "../../redux/snackbar.slice";

const StripeCheckoutButton = ({ price, period }) => {
  const priceForStripe = price * 100.00002;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_API_PUBLISHABLE_KEY;
  const correctPeriod = period === "year" ? 365 : period === "month" ? 30 : 7;
  const [issuer, setIssuer] = useState();
  const [email, setEmail] = useState();

  const user = useSelector((state) => state.user.user);
  const subscription = useSelector((state) => state.subscription.subscription);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (!user.logged) {
        const res = await fetch("/api/userDetails");
        const data = await res.json();

        setIssuer(data?.userDetails?.data?.users[0].issuer);
        setEmail(data?.userDetails?.data?.users[0].email);
        console.log(data);
      } else {
        setIssuer(user.issuer);
        setEmail(user.email);
      }
    })();
  }, []);

  const finalPrice = (priceForStripe / 100).toFixed(2);

  const onToken = async (token) => {
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
    const difference = user.planExpireDate - Date.now() / 1000;
    const expireDate =
      user.planExpireDate === 0 ? Math.floor(initialDate) : initialDate + difference;

    dispatch(
      setSnackbar({
        open: true,
        content: `Payment Successful! You have just bought a ${subscription.plan}ly subscription for $${subscription.price}. You may now use the exercise page.`,
      })
    );
    dispatch(setDialog(false));
    dispatch(
      setSubscriptionState({
        price: 0,
        plan: "",
      })
    );

    const dateToExpire = new Date(Math.round(expireDate) * 1000);
    const dateString = `${months[currentMonth]}-${currentDay}-${currentYear}`;

    const res = await fetch("/api/addPurchase", {
      method: "POST",
      headers: {
        body: JSON.stringify({
          issuer: issuer,
          planName: period,
          planPrice: finalPrice,
          paymentId: token.id,
          email: email,
          date: dateString,
        }),
      },
    });
    const data = await res.json();
    console.log(data);

    const res2 = await fetch("/api/updateSubscription", {
      method: "POST",
      headers: {
        body: JSON.stringify({
          issuer: issuer,
          planExpireDate: dateToExpire / 1000,
          paidPlan: period,
          subscribedIn: initialDate,
        }),
      },
    });
    const data2 = await res2.json();
    console.log(data2);

    dispatch(
      setUserState({
        paidPlan: period,
        planExpireDate: Math.round(expireDate),
        subscribedSince: Math.floor(Date.now() / 1000),
        ...userRedux,
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
      descriptiong={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel="Pay Now"
      token={onToken}
      stripeKey={publishableKey}
    />
  );
};

export default StripeCheckoutButton;
