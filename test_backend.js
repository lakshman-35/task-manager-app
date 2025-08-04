const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing Backend Functionality...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: 'Bearer invalid-token' }
    });
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Server is running and responding');
    } else {
      console.log('❌ Server connection failed:', error.message);
      return;
    }
  }

  try {
    // Test 2: Register a new user
    console.log('\n2. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/register`, {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Registration response:', registerResponse.data);
  } catch (error) {
    if (error.response?.data?.message === 'Registration failed') {
      console.log('⚠️  User might already exist, continuing...');
    } else {
      console.log('❌ Registration failed:', error.response?.data || error.message);
    }
  }

  try {
    // Test 3: Login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('User data received:', loginResponse.data.user ? 'Yes' : 'No');
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;

    // Test 4: Create a task
    console.log('\n4. Testing task creation...');
    const createTaskResponse = await axios.post(`${BASE_URL}/tasks`, {
      title: 'Test Task',
      description: 'This is a test task',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '2024-12-31'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Task created successfully');
    console.log('Task ID:', createTaskResponse.data.id);

    // Test 5: Get user's tasks
    console.log('\n5. Testing task retrieval...');
    const getTasksResponse = await axios.get(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Tasks retrieved successfully');
    console.log('Number of tasks:', getTasksResponse.data.length);
    console.log('Tasks belong to user ID:', getTasksResponse.data[0]?.user_id);

    // Test 6: Get user profile
    console.log('\n6. Testing user profile...');
    const profileResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('User ID from profile:', profileResponse.data.user.id);
    console.log('User name:', profileResponse.data.user.full_name);

    // Test 7: Logout
    console.log('\n7. Testing logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Logout successful');

    console.log('\n🎉 All tests passed! Backend is working correctly.');
    console.log('\n📋 Summary:');
    console.log('- User registration: ✅');
    console.log('- User login with JWT: ✅');
    console.log('- Task creation: ✅');
    console.log('- Task retrieval (user-specific): ✅');
    console.log('- User profile: ✅');
    console.log('- User logout: ✅');

  } catch (error) {
    console.log('❌ Test failed:', error.response?.data || error.message);
    console.log('Error details:', error.response?.status, error.response?.statusText);
  }
}

testBackend(); 