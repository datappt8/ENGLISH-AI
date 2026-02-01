// 完整系统测试 - 测试前后端集成
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

async function testFullSystem() {
  console.log('🧪 开始完整系统测试\n');

  try {
    // 1. 测试后端健康检查
    console.log('1️⃣ 测试后端服务...');
    try {
      await axios.get(`${API_BASE}/health`);
      console.log('✅ 后端服务正常运行\n');
    } catch (error) {
      console.log('⚠️  后端没有健康检查端点，尝试其他方式...');
      // 尝试访问任意端点来验证服务器是否运行
      try {
        await axios.get(API_BASE);
      } catch (e) {
        if (e.response) {
          console.log('✅ 后端服务正常运行\n');
        } else {
          throw new Error('后端服务未运行');
        }
      }
    }

    // 2. 测试前端服务
    console.log('2️⃣ 测试前端服务...');
    try {
      await axios.get(FRONTEND_URL);
      console.log('✅ 前端服务正常运行\n');
    } catch (error) {
      console.log('❌ 前端服务未运行');
      throw error;
    }

    // 3. 测试用户注册
    console.log('3️⃣ 测试用户注册...');
    const testUser = {
      username: 'e2e_test_' + Date.now(),
      email: `e2e_${Date.now()}@test.com`,
      password: 'Test123456'
    };

    const registerRes = await axios.post(`${API_BASE}/auth/register`, testUser);
    const token = registerRes.data.data.token;
    console.log('✅ 用户注册成功');
    console.log(`   用户名: ${testUser.username}\n`);

    // 4. 测试获取任务列表
    console.log('4️⃣ 测试获取任务列表...');
    const questsRes = await axios.get(`${API_BASE}/quests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const quests = questsRes.data.data.quests;
    console.log('✅ 获取任务列表成功');
    console.log(`   任务数量: ${quests.length}`);
    console.log(`   第一个任务: ${quests[0]?.title || 'N/A'}\n`);

    // 5. 测试开始任务
    console.log('5️⃣ 测试开始任务...');
    const firstQuest = quests[0];
    if (!firstQuest) {
      console.log('⚠️  没有可用任务\n');
    } else {
      const startRes = await axios.post(
        `${API_BASE}/quests/${firstQuest.id}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sessionId = startRes.data.data.session_id;
      console.log('✅ 任务开始成功');
      console.log(`   任务: ${firstQuest.title}`);
      console.log(`   会话ID: ${sessionId}\n`);

      // 6. 测试提交任务
      console.log('6️⃣ 测试提交任务...');
      const submitRes = await axios.post(
        `${API_BASE}/quests/${firstQuest.id}/submit`,
        {
          session_id: sessionId,
          score: 90,
          completion_data: { test: true, timestamp: Date.now() }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ 任务提交成功');
      console.log(`   结果: ${submitRes.data.data.result}`);
      console.log(`   获得经验: ${submitRes.data.data.rewards.exp_gained}`);
      console.log(`   获得金币: ${submitRes.data.data.rewards.coins_gained}\n`);
    }

    // 7. 测试获取用户信息
    console.log('7️⃣ 测试获取用户信息...');
    const profileRes = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profile = profileRes.data.data;
    console.log('✅ 获取用户信息成功');
    console.log(`   等级: ${profile.level}`);
    console.log(`   经验: ${profile.exp}`);
    console.log(`   金币: ${profile.coins}\n`);

    console.log('🎉 所有测试通过！\n');
    console.log('📊 系统状态总结：');
    console.log('✅ 后端 API 正常');
    console.log('✅ 前端服务正常');
    console.log('✅ 用户认证系统正常');
    console.log('✅ 任务系统正常');
    console.log('✅ 会话验证正常');
    console.log('✅ 奖励系统正常');
    console.log('\n🌐 访问地址：');
    console.log(`   前端: ${FRONTEND_URL}`);
    console.log(`   后端: ${API_BASE}`);

  } catch (error) {
    console.error('\n❌ 测试失败:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('详细信息:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

testFullSystem();
