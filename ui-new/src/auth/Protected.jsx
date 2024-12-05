import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector} from "react-redux";

const check_user_type = (user, type) => {

  if(!user){
    return false
  }
  
  if(user.userType && user.userType === type){
    return true
  }

  if(user.role && user.role.toLowerCase() === type){
    return true
  }
  
  return false
}


const useAuth = () => {
  const token = Cookies.get("JwtToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if(!token){
    localStorage.removeItem("user")
  }
  //console.log(user, "user,,,,,,,,,,,");
  return token && user;
};

const PublicRoute = () => {
  const auth = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (auth) {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  return auth ? null : <Outlet />;
};


const AdminPublicRoute = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate("/admin/users");
    }
  }, [auth, navigate]);

  return auth ? null : <Outlet />;
};
const SellerPublicRoute = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate("/seller");
    }
  }, [auth, navigate]);

  return auth ? null : <Outlet />;
};

const Protected = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return auth ? <Outlet /> : null;
};

const AdminProtected = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return auth ? <Outlet /> : null;
};

const SellerProtected = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return auth ? <Outlet /> : null;
};

const SellerRoutes=()=>{
const {user}=useSelector((state)=>state.auth);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth && !check_user_type(user, "seller")) {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  return auth && check_user_type(user, "seller") ? <Outlet /> : null;
}

const AdminRoutes=()=>{
  const {user}=useSelector((state)=>state.auth);
    const auth = useAuth();
    const navigate = useNavigate();

  if (auth && !check_user_type(user, "admin")) {
    navigate("/dashboard");
  }
    useEffect(() => {
      if (auth && !check_user_type(user, "admin")) {
        navigate("/dashboard");
      }
    }, [auth, navigate]);
  
    return auth && check_user_type(user, "admin") ? <Outlet /> : null;
  }

export { PublicRoute,SellerRoutes, SellerPublicRoute, SellerProtected, AdminRoutes,AdminProtected , AdminPublicRoute};
export default Protected;
