import requests
import sys
import json
from datetime import datetime

class DhadakAPITester:
    def __init__(self, base_url="https://rhythm-vibes-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED")
        else:
            print(f"❌ {test_name} - FAILED: {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f", Expected: {expected_status}"
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"

            self.log_result(name, success, details)
            
            if success:
                try:
                    return response.json()
                except:
                    return {"message": "Success"}
            return None

        except Exception as e:
            self.log_result(name, False, f"Exception: {str(e)}")
            return None

    def test_admin_registration(self):
        """Test admin registration"""
        test_email = f"admin_{datetime.now().strftime('%H%M%S')}@test.com"
        test_password = "TestPass123!"
        
        response = self.run_test(
            "Admin Registration",
            "POST",
            "admin/register",
            200,
            data={"email": test_email, "password": test_password}
        )
        
        if response and 'token' in response:
            self.token = response['token']
            self.test_email = test_email
            return True
        return False

    def test_admin_login(self):
        """Test admin login with registered credentials"""
        if not hasattr(self, 'test_email'):
            self.log_result("Admin Login", False, "No registered email available")
            return False
            
        response = self.run_test(
            "Admin Login",
            "POST", 
            "admin/login",
            200,
            data={"email": self.test_email, "password": "TestPass123!"}
        )
        
        if response and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_gallery_operations(self):
        """Test gallery CRUD operations"""
        # Test GET gallery (public)
        self.run_test("Get Gallery Photos", "GET", "gallery", 200)
        
        # Test POST gallery (auth required)
        photo_data = {
            "image_url": "https://example.com/test-photo.jpg",
            "caption": "Test Photo Caption"
        }
        
        response = self.run_test(
            "Add Gallery Photo",
            "POST",
            "gallery", 
            200,
            data=photo_data,
            auth_required=True
        )
        
        photo_id = None
        if response and 'id' in response:
            photo_id = response['id']
            
        # Test DELETE gallery (auth required)
        if photo_id:
            self.run_test(
                "Delete Gallery Photo",
                "DELETE",
                f"gallery/{photo_id}",
                200,
                auth_required=True
            )

    def test_achievements_operations(self):
        """Test achievements CRUD operations"""
        # Test GET achievements (public)
        self.run_test("Get Achievements", "GET", "achievements", 200)
        
        # Test POST achievement (auth required)
        achievement_data = {
            "title": "Test Achievement",
            "description": "This is a test achievement",
            "image_url": "https://example.com/achievement.jpg",
            "date": "March 2024"
        }
        
        response = self.run_test(
            "Add Achievement",
            "POST",
            "achievements",
            200,
            data=achievement_data,
            auth_required=True
        )
        
        achievement_id = None
        if response and 'id' in response:
            achievement_id = response['id']
            
            # Test PUT achievement (auth required)
            updated_data = {
                "title": "Updated Test Achievement",
                "description": "Updated description",
                "image_url": "https://example.com/updated.jpg",
                "date": "April 2024"
            }
            
            self.run_test(
                "Update Achievement",
                "PUT",
                f"achievements/{achievement_id}",
                200,
                data=updated_data,
                auth_required=True
            )
            
            # Test DELETE achievement (auth required)
            self.run_test(
                "Delete Achievement",
                "DELETE",
                f"achievements/{achievement_id}",
                200,
                auth_required=True
            )

    def test_team_operations(self):
        """Test team CRUD operations"""
        # Test GET team (public)
        self.run_test("Get Team Members", "GET", "team", 200)
        
        # Test POST team member (auth required)
        member_data = {
            "name": "Test Member",
            "role": "Test Role",
            "image_url": "https://example.com/member.jpg",
            "instagram": "https://instagram.com/test",
            "linkedin": "https://linkedin.com/in/test",
            "twitter": "https://twitter.com/test",
            "order": 1
        }
        
        response = self.run_test(
            "Add Team Member",
            "POST",
            "team",
            200,
            data=member_data,
            auth_required=True
        )
        
        member_id = None
        if response and 'id' in response:
            member_id = response['id']
            
            # Test PUT team member (auth required)
            updated_data = {
                "name": "Updated Test Member",
                "role": "Updated Role",
                "image_url": "https://example.com/updated-member.jpg",
                "instagram": "https://instagram.com/updated",
                "linkedin": "https://linkedin.com/in/updated",
                "twitter": "https://twitter.com/updated",
                "order": 2
            }
            
            self.run_test(
                "Update Team Member",
                "PUT",
                f"team/{member_id}",
                200,
                data=updated_data,
                auth_required=True
            )
            
            # Test DELETE team member (auth required)
            self.run_test(
                "Delete Team Member",
                "DELETE",
                f"team/{member_id}",
                200,
                auth_required=True
            )

    def test_workshop_operations(self):
        """Test workshop CRUD operations"""
        # Test GET workshops (public)
        self.run_test("Get Workshops", "GET", "workshop", 200)
        
        # Test POST workshop (auth required)
        workshop_data = {
            "title": "Test Workshop",
            "description": "This is a test workshop",
            "date": "April 15-17, 2024",
            "registration_link": "https://example.com/register",
            "image_url": "https://example.com/workshop.jpg",
            "is_active": True
        }
        
        response = self.run_test(
            "Add Workshop",
            "POST",
            "workshop",
            200,
            data=workshop_data,
            auth_required=True
        )
        
        workshop_id = None
        if response and 'id' in response:
            workshop_id = response['id']
            
            # Test PUT workshop (auth required)
            updated_data = {
                "title": "Updated Test Workshop",
                "description": "Updated description",
                "date": "May 15-17, 2024",
                "registration_link": "https://example.com/updated-register",
                "image_url": "https://example.com/updated-workshop.jpg",
                "is_active": False
            }
            
            self.run_test(
                "Update Workshop",
                "PUT",
                f"workshop/{workshop_id}",
                200,
                data=updated_data,
                auth_required=True
            )
            
            # Test DELETE workshop (auth required)
            self.run_test(
                "Delete Workshop",
                "DELETE",
                f"workshop/{workshop_id}",
                200,
                auth_required=True
            )

    def test_contact_operations(self):
        """Test contact operations"""
        # Test POST contact (public)
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "message": "This is a test message"
        }
        
        self.run_test(
            "Submit Contact Form",
            "POST",
            "contact",
            200,
            data=contact_data
        )
        
        # Test GET contact submissions (auth required)
        self.run_test(
            "Get Contact Submissions",
            "GET",
            "contact",
            200,
            auth_required=True
        )

    def test_about_operations(self):
        """Test about content operations"""
        # Test GET about (public)
        self.run_test("Get About Content", "GET", "about", 200)
        
        # Test PUT about (auth required)
        about_data = {
            "content": "This is updated about content for testing purposes."
        }
        
        self.run_test(
            "Update About Content",
            "PUT",
            "about",
            200,
            data=about_data,
            auth_required=True
        )

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Dhadak API Tests...")
        print(f"Testing against: {self.base_url}")
        print("=" * 50)
        
        # Test admin authentication first
        if not self.test_admin_registration():
            print("❌ Admin registration failed, stopping tests")
            return False
            
        if not self.test_admin_login():
            print("❌ Admin login failed, stopping tests")
            return False
            
        # Test all API endpoints
        self.test_gallery_operations()
        self.test_achievements_operations()
        self.test_team_operations()
        self.test_workshop_operations()
        self.test_contact_operations()
        self.test_about_operations()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return False

def main():
    tester = DhadakAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())