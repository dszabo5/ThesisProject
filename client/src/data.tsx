import LandingPage from "./pages/LandingPage"
import MainPage from "./pages/MainPage"
import UploadPage from "./pages/UploadPage"
import SettingsPage from "./pages/SettingsPage"
import ResultsPage from "./pages/ResultsPage"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
export default function(){
    const data=[
        {
            id:0,
            label:"Home",
            img:<HomeOutlinedIcon/>,
            component:<LandingPage/>,
            path:"/"

        },
        {
            id:1,
            label:"File Comparison",
            img:<DesignServicesOutlinedIcon/>,
            component:<MainPage/>,
            path:"/main"

        },
        {
            id:2,
            label:"Upload Documents",
            img:<DriveFolderUploadOutlinedIcon/>,
            component:<UploadPage/>,
            path:"/upload"

        },
        {
            id:3,
            label:"Settings",
            img:<SettingsOutlinedIcon/>,
            component:<SettingsPage/>,
            path:"/settings"

        }
    ]
    return data
}

// export default data