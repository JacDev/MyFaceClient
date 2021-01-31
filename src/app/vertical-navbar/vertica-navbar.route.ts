import { VerticalNavbarComponent } from "./vertical-navbar.component";

export const verticalNavbarRoutes = [
  { path: '', component: VerticalNavbarComponent},
  { path: '**', component: VerticalNavbarComponent},
]