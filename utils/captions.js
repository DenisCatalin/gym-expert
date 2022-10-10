import PURCHASE_STYLES from "../css/components/AlertDialog.module.css";
import { useSelector } from "react-redux";
const Purchase = () => {
  const subscription = useSelector((state) => state.subscription.subscription);
  return (
    <>
      {" "}
      <span className={PURCHASE_STYLES.emphasize}>{subscription.plan}ly subscription </span> on our
      platform for <span className={PURCHASE_STYLES.emphasize}>${subscription.price}</span>.
    </>
  );
};

export const ABOUT_TYPOGRAPHY = {
  mainContent:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Felis eget nunc lobortis mattis aliquam. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Facilisi cras fermentum odio eu feugiat pretium nibh. Nisi porta lorem mollis aliquam ut porttitor leo a. Vulputate mi sit amet mauris commodo quis imperdiet. Facilisi nullam vehicula ipsum a arcu cursus vitae. Ut aliquam purus sit amet luctus venenatis lectus. Ac ut consequat semper viverra nam libero justo. Sit amet dictum sit amet justo. Risus pretium quam vulputate dignissim suspendisse in. Aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat. Nibh ipsum consequat nisl vel pretium. Risus sed vulputate odio ut enim. Egestas diam in arcu cursus. Lectus arcu bibendum at varius vel pharetra. Eget dolor morbi non arcu risus quis varius quam quisque. Lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique. Cras ornare arcu dui vivamus. In vitae turpis massa sed elementum tempus egestas. Praesent semper feugiat nibh sed pulvinar proin gravida. Elementum tempus egestas sed sed risus. Id eu nisl nunc mi ipsum. Ultrices sagittis orci a scelerisque purus semper eget duis at. Tortor vitae purus faucibus ornare suspendisse sed nisi. Leo urna molestie at elementum eu. Malesuada fames ac turpis egestas integer eget aliquet nibh praesent. Hendrerit gravida rutrum quisque non tellus orci ac auctor augue. Nisi porta lorem mollis aliquam ut. Commodo odio aenean sed adipiscing. Morbi leo urna molestie at elementum eu facilisis. Arcu felis bibendum ut tristique et egestas. Diam volutpat commodo sed egestas egestas fringilla phasellus faucibus scelerisque. In eu mi bibendum neque egestas congue quisque egestas. Nunc lobortis mattis aliquam faucibus purus. Aliquam sem et tortor consequat id. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. Aliquet nec ullamcorper sit amet risus nullam eget. Feugiat vivamus at augue eget arcu dictum varius duis at. Quam quisque id diam vel quam. In vitae turpis massa sed elementum tempus egestas sed. At risus viverra adipiscing at in tellus integer. Risus in hendrerit gravida rutrum quisque non tellus orci. Enim nec dui nunc mattis. Eleifend donec pretium vulputate sapien nec sagittis. Accumsan tortor posuere ac ut consequat semper viverra nam. Tempus imperdiet nulla malesuada pellentesque. Euismod lacinia at quis risus sed vulputate odio ut. Nibh mauris cursus mattis molestie a iaculis at erat pellentesque. Tristique senectus et netus et malesuada fames. Mattis aliquam faucibus purus in massa tempor nec feugiat. Ultrices mi tempus imperdiet nulla malesuada. Donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt. Integer quis auctor elit sed vulputate mi. Auctor eu augue ut lectus arcu bibendum at varius vel. Euismod elementum nisi quis eleifend quam adipiscing vitae proin sagittis. Cursus in hac habitasse platea dictumst quisque sagittis. Ut consequat semper viverra nam libero justo laoreet sit amet. Condimentum mattis pellentesque id nibh tortor id. Nisi porta lorem mollis aliquam ut. Arcu odio ut sem nulla pharetra diam sit amet. Viverra orci sagittis eu volutpat odio facilisis. Platea dictumst quisque sagittis purus sit amet volutpat consequat. Ornare arcu odio ut sem nulla. Mauris cursus mattis molestie a. Tincidunt tortor aliquam nulla facilisi. Augue lacus viverra vitae congue. Dignissim diam quis enim lobortis scelerisque fermentum dui. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies.",
};

export const PURCHASE_DIALOG = {
  title: "We need you to be aware of the fact that...",
  content: (
    <>
      You are about to purchase a <Purchase /> In order to go forward, we need your confirmation.
    </>
  ),
};
