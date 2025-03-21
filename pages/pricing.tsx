import styles from "../css/Pricing.module.css";
import PricingCard from "../components/pricing-cards/PricingCard.c";
import Head from "next/head";

const Pricing = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Pricing</title>
      </Head>
      <div className={styles.content}>
        <PricingCard price={10} period={"week"} image={"/static/undraw_mindfulness_scgo.svg"} />
        <PricingCard
          price={250}
          image={"/static/undraw_activity_tracker_re_2lvv.svg"}
          period={"year"}
        />
        <PricingCard
          price={30}
          period={"month"}
          image={"/static/undraw_fitness_tracker_3033.svg"}
        />
      </div>
    </div>
  );
};

export default Pricing;
