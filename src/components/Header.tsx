import Link from 'next/link';

const linkStyle = {
  marginRight: 15
};

const Header = () => (
  <div>
    <Link href="/" style={linkStyle}>
      Home
    </Link>
    <Link href="/topic" style={linkStyle}>
      Topic
    </Link>
  </div>
);

export default Header;