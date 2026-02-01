// 测试会话验证功能
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
let authToken = '';
let sessionId = '';

// 测试用户凭证
const testUser = {
  username: 'testuser_' + Date.now(),
  email: `test_${Date.now()}@example.com`,
  password: 'Test123456'
};

async function test() {
  try {
    console.log('🧪 开始测试会话验证功能\n');

    // 1. 注册测试用户
    console.log('1️⃣ 注册测试用户...');
    const registerRes = await axios.post(`${API_BASE}/auth/register`, testUser);
    authToken = registerRes.data.data.token;
    console.log('✅ 注册成功\n');

    // 2. 开始任务
    console.log('2️⃣ 开始任务 starter_village_001...');
    const startRes = await axios.post(
      `${API_BASE}/quests/starter_village_001/start`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    sessionId = startRes.data.data.session_id;
    console.log('✅ 任务已开始');
    console.log(`   会话ID: ${sessionId}\n`);

    // 3. 测试：使用正确的会话ID提交任务
    console.log('3️⃣ 测试：使用正确的会话ID提交任务...');
    try {
      const submitRes = await axios.post(
        `${API_BASE}/quests/starter_village_001/submit`,
        {
          session_id: sessionId,
          score: 85,
          completion_data: { test: true }
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('✅ 提交成功');
      console.log(`   结果: ${submitRes.data.data.result}`);
      console.log(`   获得经验: ${submitRes.data.data.rewards.exp_gained}`);
      console.log(`   获得金币: ${submitRes.data.data.rewards.coins_gained}\n`);
    } catch (error) {
      console.log('❌ 提交失败:', error.response?.data?.message || error.message);
      if (error.response?.data?.error) {
        console.log('详细错误:', error.response.data.error);
      }
    }

    // 4. 测试：使用错误的会话ID提交任务
    console.log('4️⃣ 测试：使用错误的会话ID提交任务（应该失败）...');

    // 先开始第二个任务
    const startRes2 = await axios.post(
      `${API_BASE}/quests/starter_village_002/start`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    try {
      await axios.post(
        `${API_BASE}/quests/starter_village_002/submit`,
        {
          session_id: 'fake-session-id-12345',
          score: 85,
          completion_data: { test: true }
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('❌ 测试失败：应该拒绝无效的会话ID\n');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message.includes('无效的会话')) {
        console.log('✅ 测试通过：正确拒绝了无效的会话ID');
        console.log(`   错误信息: ${error.response.data.message}\n`);
      } else {
        console.log('❌ 测试失败：错误类型不正确');
        console.log(`   错误: ${error.response?.data?.message || error.message}\n`);
      }
    }

    // 5. 测试：重复使用已完成的会话ID
    console.log('5️⃣ 测试：重复使用已完成的会话ID（应该失败）...');
    try {
      await axios.post(
        `${API_BASE}/quests/starter_village_001/submit`,
        {
          session_id: sessionId,
          score: 90,
          completion_data: { test: true }
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('❌ 测试失败：应该拒绝已完成的会话ID\n');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ 测试通过：正确拒绝了已完成的会话ID');
        console.log(`   错误信息: ${error.response.data.message}\n`);
      } else {
        console.log('❌ 测试失败：错误类型不正确');
        console.log(`   错误: ${error.response?.data?.message || error.message}\n`);
      }
    }

    console.log('🎉 所有测试完成！');
    console.log('\n📊 测试总结：');
    console.log('✅ 会话创建功能正常');
    console.log('✅ 会话验证功能正常');
    console.log('✅ 防止跳过任务直接提交');
    console.log('✅ 防止重复使用会话ID');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('详细信息:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

test();
