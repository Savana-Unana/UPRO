import MainMenuPage from '../pages/main-menu/MainMenuPage.jsx'
import AnimatrixPage from '../pages/animatrix/AnimatrixPage.jsx'
import CatalogPage from '../pages/catalog/CatalogPage.jsx'
import ChatPage from '../pages/chat/ChatPage.jsx'
import ConstructionPage from '../pages/construction/ConstructionPage.jsx'
import CredtrixPage from '../pages/credits/CredtrixPage.jsx'
import FriendPage from '../pages/friend/FriendPage.jsx'
import GuessrPage from '../pages/guessr/GuessrPage.jsx'
import GuessWhoPage from '../pages/guess-who/GuessWhoPage.jsx'
import HurtyPage from '../pages/hurty/HurtyPage.jsx'
import MapPage from '../pages/map/MapPage.jsx'
import NormalPage from '../pages/normal/NormalPage.jsx'
import OstPage from '../pages/ost/OstPage.jsx'
import SongVotePage from '../pages/song-vote/SongVotePage.jsx'
import TypeChartPage from '../pages/type-chart/TypeChartPage.jsx'
import UproRdlePage from '../pages/upro-rdle/UproRdlePage.jsx'
import VotePage from '../pages/vote/VotePage.jsx'

export const routes = [
  { path: '/', title: 'Erm Ma Ha Sigma', Component: MainMenuPage },
  { path: '/animatrix', title: 'Animatrix', Component: AnimatrixPage },
  { path: '/catalog', title: 'Catalog', Component: CatalogPage },
  { path: '/chat', title: 'Dialogue Box Builder', Component: ChatPage },
  { path: '/construction', title: 'Under Construction', Component: ConstructionPage },
  { path: '/credtrix', title: 'Guys thats literally my idea', Component: CredtrixPage },
  { path: '/friend', title: 'Friend In Us', Component: FriendPage },
  { path: '/guessr', title: 'Guessr', Component: GuessrPage },
  { path: '/guesswho', title: 'Animatrix Guess Who?', Component: GuessWhoPage },
  { path: '/hurty', title: 'Moves & Abilities', Component: HurtyPage },
  { path: '/map', title: 'Shiverica Map', Component: MapPage },
  { path: '/normal', title: 'Normal Mode', Component: NormalPage },
  { path: '/ost', title: 'Le Official Soundtrack', Component: OstPage },
  { path: '/songvote', title: 'UPRO Song Vote', Component: SongVotePage },
  { path: '/typechart', title: 'UPRO Type Chart', Component: TypeChartPage },
  { path: '/upro-rdle', title: 'UPROrdle', Component: UproRdlePage },
  { path: '/vote', title: 'UPRO Vote', Component: VotePage },
]

export const legacyRouteRedirects = new Map([
  ['/index.html', '/'],
  ['/animatrix.html', '/animatrix'],
  ['/catalog.html', '/catalog'],
  ['/chat.html', '/chat'],
  ['/construction.html', '/construction'],
  ['/credtrix.html', '/credtrix'],
  ['/Credtrix.html', '/credtrix'],
  ['/friend.html', '/friend'],
  ['/guessr.html', '/guessr'],
  ['/guesswho.html', '/guesswho'],
  ['/hurty.html', '/hurty'],
  ['/map.html', '/map'],
  ['/normal.html', '/normal'],
  ['/ost.html', '/ost'],
  ['/songvote.html', '/songvote'],
  ['/typechart.html', '/typechart'],
  ['/UPROrdle.html', '/upro-rdle'],
  ['/up-rordle.html', '/upro-rdle'],
  ['/vote.html', '/vote'],
])
