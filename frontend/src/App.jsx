import { Navbar } from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { Contact } from './pages/Contact'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { Footer } from './components/Footer'
import { UserDashboard } from './pages/UserDashboard'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { MyBookings } from './pages/MyBookings'
import { ServiceDetails } from './pages/ServiceDetails'
import { BookingSuccess } from './pages/BookingSuccess'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import { ProviderDashboard } from './pages/ProviderDashboard'
import { AddService } from './pages/AddService'


function App() {

  return (
    <>
      <AuthProvider>

          <Router>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#0f172a",
                  color: "#fff",
                },
              }}
            />
            <Navbar />

            <Routes>

              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/services' element={<Services />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />

              <Route
                path='/user-dashboard'
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/mybookings'
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/service/:id'
                element={
                  <ProtectedRoute>
                    <ServiceDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/booking-success'
                element={
                  <ProtectedRoute>
                    <BookingSuccess />
                  </ProtectedRoute>
                }
              />

              <Route 
                path = '/provider-dashboard' 
                element={
                  <ProtectedRoute>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
               path='/add-service'
               element={
                <ProtectedRoute>
                  <AddService />
                </ProtectedRoute>} />

            </Routes>

            <Footer />

          </Router>

      </AuthProvider>
    </>
  );
};

export default App;