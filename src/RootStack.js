import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import SplashComponent from "./SplashComponent";
import SignInComponent from "./SignInComponent";
import SignUpConponent from "./SignUpConponent";
import HomePage from "./HomePage";
import TabNavigation from "./TabNavigation";
import CouponPage from "./CouponPage";
import CupRentalPage from "./CupRentalPage";
import MapPgae from "./MapPage";
import UserPage from "./UserPage";
import UserPage_Profile from "./UserPage_Profile";
import UserPage_Comment from "./UserPage_Comment";
import UserPage_About from "./UserPage_About";
import UserPage_EditProfile from './UserPage_EditProfile';
import DetailPage from './DetailPage';
import OrderPage from './OrderPage';
import GamePage from './GamePage';
import RentalChangePage from './RentalChange';
import OnboardingScreen from './OnboardingScreen';

const StackNavigator = createStackNavigator(
    {
        SplashScreen: {
            screen: SplashComponent,
            navigationOptions: {
                headerShown: false
            }
        },
        SignInScreen: {
            screen: SignInComponent,
            navigationOptions: {
                headerShown: false
            }
        },
        SignUpScreen: {
            screen: SignUpConponent,
            navigationOptions: {
                headerShown: false
            }
        },
        HomePage: {
            screen: HomePage,
            navigationOptions: {
                headerShown: false
            }
        },
        TabScreen: {
            screen: TabNavigation,
            navigationOptions: {
                headerShown: false
            }
        },
        CouponScreen: {
            screen: CouponPage,
            navigationOptions: {
                headerShown: false
            }
        },
        CupRentalScreen: {
            screen: CupRentalPage,
            navigationOptions: {   
                title: "掃描條碼",
                headerBackTitle: ' ',
                headerStyle: {
                    backgroundColor: '#04151f',
                },
                headerTitleStyle: {
                    color: '#ded7ca'
                },
                headerTintColor: '#ded7ca'
            }
        },
        RentalChangeScreen:{
            screen:RentalChangePage,
            navigationOptions: {
                headerShown: false
            }
        },
        OrderScreen: {
            screen: OrderPage,
            navigationOptions: {
                headerShown: false,
                title: "SHARE-DRINK",
                headerBackTitle: ' ',
                headerStyle: {
                    backgroundColor: '#04151f',
                },
                headerTitleStyle: {
                    color: '#ded7ca'
                },
                headerTintColor: '#ded7ca'
            }
        },
        GameScreen:{
            screen:GamePage,
            navigationOptions: {
                headerShown: true,
                headerBackTitle: '返回',
                title:"RENTER 出任務",
                
                headerStyle: {
                    backgroundColor: '#04151f',
                },
                headerTitleStyle: {
                    color: '#ded7ca',
                   marginLeft:Platform.OS === 'ios' ? 0 :-40,
                    textAlign:'center'
                },
                headerTintColor: '#04151f'
            }
        },
        MapScreen: {
            screen: MapPgae,
            navigationOptions: {
                headerShown: false
            }
        },
        UserScreen: {
            screen: UserPage,
            navigationOptions: {
                headerShown: false
            }
        },
        ProfileScreen: {
            screen: UserPage_Profile,

        },
        EditProfileScreen: {
            screen: UserPage_EditProfile,
            navigationOptions: {
                headerShown: true,
                title: "修改個人資料",
                headerBackTitle: '返回',
                headerStyle: {
                    backgroundColor: '#04151f',
                },
                headerTitleStyle: {
                    color: 'white'
                },
                headerTintColor: 'white',
                

            }
        },
        CommentScreen: {
            screen: UserPage_Comment,
            navigationOptions: {
                headerShown: true,
                title: "意見回覆",
                headerBackTitle: '返回',
                headerStyle: {
                    backgroundColor: '#04151f',
                },
                headerTitleStyle: {
                    color: 'white'
                },
                headerTintColor: 'white'
            }

        },
        AboutScreen: {
            screen: UserPage_About,
            navigationOptions: {
                headerShown: true,
                title: "關於我們",
                headerBackTitle: '返回',
                headerStyle: {
                    backgroundColor: '#04151f',
                },
                headerTitleStyle: {
                    color: 'white'
                },
                headerTintColor: 'white'
            }
        },
        DetailScreen: {
            screen: DetailPage,
            navigationOptions: {
                headerShown: false
            }
        },
        OnboardingScreen:{
            screen: OnboardingScreen,
            navigationOptions: {
                headerShown: false
            }
        }
    });


export default createAppContainer(StackNavigator);
