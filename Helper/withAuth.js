// import Cookies from 'js-cookie';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export const WithAuth = (WrappedComponent) => {
//   const Wrapper = (props) => {
//     const router = useRouter();

//     useEffect(() => {
//       const accessToken = Cookies.get('access_token');
//       if (!accessToken) {
//         const { pathname, query } = router;
//         const queryParams = new URLSearchParams(query).toString();
//         const returnUrl = `${pathname}${queryParams ? `?${queryParams}` : ''}`;

//         router.push(`/login?returnTo=${encodeURIComponent(returnUrl)}`);
//       }
//     }, []);

//     return <WrappedComponent {...props} />;
//   };

//   return Wrapper;
// };