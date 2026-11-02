// =======================================================
// In-Memory Mock Database for HMMS
// Provides complete offline/standalone database capability
// without requiring an external MySQL server.
// =======================================================

const initialData = () => ({
  USER: [
    {
      user_id: 1,
      username: "admin",
      email: "admin@hmms.edu",
      password_hash: "$2b$10$9wAHZxnbXmSCyadXCL2a5u.Wr7fVpWBtPFChSvqYgV6tHOZKj9UNq", // password123
      role: "ADMIN",
      phone: "9876543210",
      created_at: new Date("2026-08-01")
    },
    {
      user_id: 2,
      username: "warden",
      email: "warden@hmms.edu",
      password_hash: "$2b$10$9wAHZxnbXmSCyadXCL2a5u.Wr7fVpWBtPFChSvqYgV6tHOZKj9UNq", // password123
      role: "WARDEN",
      phone: "9876543211",
      created_at: new Date("2026-08-01")
    },
    {
      user_id: 3,
      username: "messmanager",
      email: "mess@hmms.edu",
      password_hash: "$2b$10$9wAHZxnbXmSCyadXCL2a5u.Wr7fVpWBtPFChSvqYgV6tHOZKj9UNq", // password123
      role: "MESS_MANAGER",
      phone: "9876543212",
      created_at: new Date("2026-08-01")
    },
    {
      user_id: 4,
      username: "student",
      email: "student@hmms.edu",
      password_hash: "$2b$10$9wAHZxnbXmSCyadXCL2a5u.Wr7fVpWBtPFChSvqYgV6tHOZKj9UNq", // password123
      role: "STUDENT",
      phone: "9876543213",
      created_at: new Date("2026-08-01")
    },
    {
      user_id: 5,
      username: "rahul_sharma",
      email: "rahul@hmms.edu",
      password_hash: "$2b$10$9wAHZxnbXmSCyadXCL2a5u.Wr7fVpWBtPFChSvqYgV6tHOZKj9UNq", // password123
      role: "STUDENT",
      phone: "9876543214",
      created_at: new Date("2026-08-05")
    },
    {
      user_id: 6,
      username: "priya_patel",
      email: "priya@hmms.edu",
      password_hash: "$2b$10$9wAHZxnbXmSCyadXCL2a5u.Wr7fVpWBtPFChSvqYgV6tHOZKj9UNq", // password123
      role: "STUDENT",
      phone: "9876543215",
      created_at: new Date("2026-08-10")
    }
  ],
  STUDENT: [
    {
      student_id: 1,
      user_id: 4,
      roll_no: "CS202601",
      department: "Computer Science & Engineering",
      year_of_study: 4,
      guardian_contact: "9876543299"
    },
    {
      student_id: 2,
      user_id: 5,
      roll_no: "CS202602",
      department: "Information Technology",
      year_of_study: 3,
      guardian_contact: "9876543288"
    },
    {
      student_id: 3,
      user_id: 6,
      roll_no: "CS202603",
      department: "Electronics & Communication",
      year_of_study: 2,
      guardian_contact: "9876543277"
    }
  ],
  WARDEN: [
    {
      warden_id: 1,
      user_id: 2,
      hostel_block: "Block A"
    }
  ],
  MESS_MANAGER: [
    {
      manager_id: 1,
      user_id: 3,
      mess_name: "Central Dining Hall"
    }
  ],
  ROOM: [
    {
      room_id: 1,
      room_number: "A-101",
      room_type: "SINGLE",
      capacity: 1,
      occupied_count: 1,
      status: "FULL"
    },
    {
      room_id: 2,
      room_number: "A-102",
      room_type: "DOUBLE",
      capacity: 2,
      occupied_count: 1,
      status: "AVAILABLE"
    },
    {
      room_id: 3,
      room_number: "A-103",
      room_type: "TRIPLE",
      capacity: 3,
      occupied_count: 0,
      status: "AVAILABLE"
    },
    {
      room_id: 4,
      room_number: "B-201",
      room_type: "DOUBLE",
      capacity: 2,
      occupied_count: 1,
      status: "AVAILABLE"
    },
    {
      room_id: 5,
      room_number: "B-202",
      room_type: "SINGLE",
      capacity: 1,
      occupied_count: 0,
      status: "AVAILABLE"
    }
  ],
  ROOM_ALLOCATION: [
    {
      allocation_id: 1,
      student_id: 1,
      room_id: 1,
      approved_by: 1,
      status: "APPROVED",
      allocation_date: new Date("2026-08-01")
    },
    {
      allocation_id: 2,
      student_id: 2,
      room_id: 2,
      approved_by: 1,
      status: "APPROVED",
      allocation_date: new Date("2026-08-01")
    },
    {
      allocation_id: 3,
      student_id: 3,
      room_id: 4,
      approved_by: 1,
      status: "APPROVED",
      allocation_date: new Date("2026-08-01")
    }
  ],
  ATTENDANCE: [
    { attendance_id: 1, student_id: 1, date: "2026-10-04", meal_type: "BREAKFAST", present: 1 },
    { attendance_id: 2, student_id: 1, date: "2026-10-04", meal_type: "LUNCH", present: 1 },
    { attendance_id: 3, student_id: 1, date: "2026-10-04", meal_type: "DINNER", present: 1 },
    { attendance_id: 4, student_id: 1, date: "2026-10-03", meal_type: "BREAKFAST", present: 1 },
    { attendance_id: 5, student_id: 1, date: "2026-10-03", meal_type: "LUNCH", present: 1 },
    { attendance_id: 6, student_id: 1, date: "2026-10-03", meal_type: "DINNER", present: 0 },
    { attendance_id: 7, student_id: 2, date: "2026-10-04", meal_type: "BREAKFAST", present: 1 },
    { attendance_id: 8, student_id: 2, date: "2026-10-04", meal_type: "LUNCH", present: 1 },
    { attendance_id: 9, student_id: 3, date: "2026-10-04", meal_type: "BREAKFAST", present: 1 }
  ],
  LEAVE_APPLICATION: [
    {
      leave_id: 1,
      student_id: 1,
      reason: "Family function & regional festival celebration",
      from_date: "2026-10-10",
      to_date: "2026-10-14",
      status: "PENDING",
      warden_id: null,
      applied_date: new Date("2026-10-02")
    },
    {
      leave_id: 2,
      student_id: 2,
      reason: "Medical consultation and recovery at hometown",
      from_date: "2026-09-20",
      to_date: "2026-09-22",
      status: "APPROVED",
      warden_id: 1,
      applied_date: new Date("2026-09-18")
    }
  ],
  FEE: [
    {
      fee_id: 1,
      student_id: 1,
      amount: "25000.00",
      fee_type: "HOSTEL_MESS",
      due_date: "2026-10-31",
      status: "PAID",
      paid_date: new Date("2026-08-15")
    },
    {
      fee_id: 2,
      student_id: 1,
      amount: "5000.00",
      fee_type: "MAINTENANCE",
      due_date: "2026-11-15",
      status: "PENDING",
      paid_date: null
    },
    {
      fee_id: 3,
      student_id: 2,
      amount: "25000.00",
      fee_type: "HOSTEL_MESS",
      due_date: "2026-10-31",
      status: "PAID",
      paid_date: new Date("2026-08-10")
    }
  ],
  COMPLAINT: [
    {
      complaint_id: 1,
      student_id: 1,
      category: "ROOM",
      description: "Ceiling fan speed regulator not functioning in Room A-101.",
      status: "OPEN",
      resolved_by: null,
      submitted_date: new Date("2026-10-01"),
      resolved_date: null,
      resolution_notes: null
    },
    {
      complaint_id: 2,
      student_id: 2,
      category: "MESS",
      description: "Warm drinking water dispenser empty in second floor dining wing.",
      status: "RESOLVED",
      resolved_by: 1,
      submitted_date: new Date("2026-09-25"),
      resolved_date: new Date("2026-09-26"),
      resolution_notes: "Water filter serviced and reservoir replenished."
    }
  ],
  NOTIFICATIONS: [
    {
      notification_id: 1,
      user_id: 4,
      title: "Welcome to HMMS",
      message: "Your residential room A-101 has been confirmed for the current academic session.",
      is_read: 0,
      created_at: new Date("2026-08-01")
    },
    {
      notification_id: 2,
      user_id: 4,
      title: "Mess Menu Published",
      message: "Special Sunday dining menu announced by Mess Management.",
      is_read: 1,
      created_at: new Date("2026-10-01")
    }
  ],
  menu_item: [
    { item_id: 1, mess_id: 1, name: "Masala Dosa, Sambar & Chutney", meal_type: "BREAKFAST", day: "Monday" },
    { item_id: 2, mess_id: 1, name: "Vegetable Biryani, Raita & Gulab Jamun", meal_type: "LUNCH", day: "Monday" },
    { item_id: 3, mess_id: 1, name: "Tea & Veg Samosa", meal_type: "SNACKS", day: "Monday" },
    { item_id: 4, mess_id: 1, name: "Chapati, Paneer Butter Masala & Dal Tadka", meal_type: "DINNER", day: "Monday" },
    { item_id: 5, mess_id: 1, name: "Poori Bhaji & Filter Coffee", meal_type: "BREAKFAST", day: "Tuesday" },
    { item_id: 6, mess_id: 1, name: "South Indian Thali (Rice, Sambar, Rasam, Poriyal)", meal_type: "LUNCH", day: "Tuesday" },
    { item_id: 7, mess_id: 1, name: "Tea & Biscuits", meal_type: "SNACKS", day: "Tuesday" },
    { item_id: 8, mess_id: 1, name: "Fried Rice & Veg Manchurian", meal_type: "DINNER", day: "Tuesday" },
    { item_id: 9, mess_id: 1, name: "Idli, Vada, Sambar & Coconut Chutney", meal_type: "BREAKFAST", day: "Wednesday" },
    { item_id: 10, mess_id: 1, name: "Jeera Rice, Dal Makhani & Mixed Veg Curry", meal_type: "LUNCH", day: "Wednesday" },
    { item_id: 11, mess_id: 1, name: "Coffee & Veg Puff", meal_type: "SNACKS", day: "Wednesday" },
    { item_id: 12, mess_id: 1, name: "Phulka, Aloo Gobi & Curd Rice", meal_type: "DINNER", day: "Wednesday" },
    { item_id: 13, mess_id: 1, name: "Pongal, Medu Vada & Chutney", meal_type: "BREAKFAST", day: "Thursday" },
    { item_id: 14, mess_id: 1, name: "Lemon Rice, Curd Rice & Potato Fry", meal_type: "LUNCH", day: "Thursday" },
    { item_id: 15, mess_id: 1, name: "Tea & Sundal", meal_type: "SNACKS", day: "Thursday" },
    { item_id: 16, mess_id: 1, name: "Parotta, Veg Kurma & Sweet Kesari", meal_type: "DINNER", day: "Thursday" },
    { item_id: 17, mess_id: 1, name: "Upma, Sambar & Filter Coffee", meal_type: "BREAKFAST", day: "Friday" },
    { item_id: 18, mess_id: 1, name: "Meals with Rasam, Kootu & Appalam", meal_type: "LUNCH", day: "Friday" },
    { item_id: 19, mess_id: 1, name: "Tea & Bajji", meal_type: "SNACKS", day: "Friday" },
    { item_id: 20, mess_id: 1, name: "Naan, Paneer Tikka Masala & Kheer", meal_type: "DINNER", day: "Friday" },
    { item_id: 21, mess_id: 1, name: "Aloo Paratha, Curd & Pickle", meal_type: "BREAKFAST", day: "Saturday" },
    { item_id: 22, mess_id: 1, name: "Bisibelebath, Boondi Raita & Chips", meal_type: "LUNCH", day: "Saturday" },
    { item_id: 23, mess_id: 1, name: "Coffee & Cake", meal_type: "SNACKS", day: "Saturday" },
    { item_id: 24, mess_id: 1, name: "Veg Pulao, Dal Fry & Ice Cream", meal_type: "DINNER", day: "Saturday" },
    { item_id: 25, mess_id: 1, name: "Chole Bhature & Sweet Lassi", meal_type: "BREAKFAST", day: "Sunday" },
    { item_id: 26, mess_id: 1, name: "Special Feast Meal & Payasam", meal_type: "LUNCH", day: "Sunday" },
    { item_id: 27, mess_id: 1, name: "Tea & Cutlet", meal_type: "SNACKS", day: "Sunday" },
    { item_id: 28, mess_id: 1, name: "Dosa Varieties & Chutney Duo", meal_type: "DINNER", day: "Sunday" }
  ]
});

let dbState = initialData();

function executeMockQuery(sql, params = []) {
  const s = sql.replace(/\s+/g, " ").trim();
  const lower = s.toLowerCase();

  // ----------------------------------------------------
  // 1. AUTH / USER LOOKUPS
  // ----------------------------------------------------
  if (lower.startsWith("select * from user where username=?") || lower.startsWith("select * from user where username = ?")) {
    const username = params[0];
    const user = dbState.USER.find(u => u.username === username);
    return [user ? [user] : []];
  }

  if (lower.startsWith("select user_id from user where email=?") || lower.startsWith("select user_id from user where email = ?")) {
    const email = params[0];
    const user = dbState.USER.find(u => u.email === email);
    return [user ? [{ user_id: user.user_id }] : []];
  }

  if (lower.startsWith("insert into user")) {
    // (username, email, password_hash, phone, role)
    const [username, email, password_hash, phone] = params;
    const roleMatch = s.match(/'(STUDENT|WARDEN|MESS_MANAGER|ADMIN)'/i);
    const role = roleMatch ? roleMatch[1].toUpperCase() : "STUDENT";
    const nextId = dbState.USER.length ? Math.max(...dbState.USER.map(u => u.user_id)) + 1 : 1;
    const newUser = { user_id: nextId, username, email, password_hash, phone, role, created_at: new Date() };
    dbState.USER.push(newUser);
    return [{ insertId: nextId, affectedRows: 1 }];
  }

  if (lower.startsWith("insert into student")) {
    const [user_id, roll_no, department, year_of_study, guardian_contact] = params;
    const nextId = dbState.STUDENT.length ? Math.max(...dbState.STUDENT.map(st => st.student_id)) + 1 : 1;
    const newStudent = { student_id: nextId, user_id, roll_no, department, year_of_study, guardian_contact };
    dbState.STUDENT.push(newStudent);
    return [{ insertId: nextId, affectedRows: 1 }];
  }

  if (lower.startsWith("insert into warden")) {
    const [user_id, hostel_block] = params;
    const nextId = dbState.WARDEN.length ? Math.max(...dbState.WARDEN.map(w => w.warden_id)) + 1 : 1;
    dbState.WARDEN.push({ warden_id: nextId, user_id, hostel_block });
    return [{ insertId: nextId, affectedRows: 1 }];
  }

  if (lower.startsWith("insert into mess_manager")) {
    const [user_id, mess_name] = params;
    const nextId = dbState.MESS_MANAGER.length ? Math.max(...dbState.MESS_MANAGER.map(m => m.manager_id)) + 1 : 1;
    dbState.MESS_MANAGER.push({ manager_id: nextId, user_id, mess_name });
    return [{ insertId: nextId, affectedRows: 1 }];
  }

  // ----------------------------------------------------
  // 2. STUDENT PROFILES & DETAILS
  // ----------------------------------------------------
  if (lower.includes("from user u join student s on u.user_id = s.user_id where u.user_id = ?") ||
      lower.includes("from student s join user u on s.user_id = u.user_id where u.user_id = ?")) {
    const userId = Number(params[0]);
    const student = dbState.STUDENT.find(st => st.user_id === userId);
    const user = dbState.USER.find(u => u.user_id === userId);
    if (!student || !user) return [[]];
    return [[{
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      student_id: student.student_id,
      roll_no: student.roll_no,
      department: student.department,
      year_of_study: student.year_of_study,
      guardian_contact: student.guardian_contact
    }]];
  }

  if (lower.startsWith("select student_id from student where user_id=?") || lower.startsWith("select student_id from student where user_id = ?")) {
    const userId = Number(params[0]);
    const st = dbState.STUDENT.find(s => s.user_id === userId);
    return [st ? [{ student_id: st.student_id }] : []];
  }

  if (lower.startsWith("select user_id from student where student_id=?") || lower.startsWith("select user_id from student where student_id = ?")) {
    const studentId = Number(params[0]);
    const st = dbState.STUDENT.find(s => s.student_id === studentId);
    return [st ? [{ user_id: st.user_id }] : []];
  }

  // ----------------------------------------------------
  // 3. ROOMS & ALLOCATIONS
  // ----------------------------------------------------
  if (lower.includes("from room_allocation ra join student s on ra.student_id = s.student_id join room r on ra.room_id = r.room_id where s.user_id = ?") ||
      lower.includes("from student s join room_allocation ra on s.student_id=ra.student_id join room r on ra.room_id=r.room_id where s.user_id=?")) {
    const userId = Number(params[0]);
    const student = dbState.STUDENT.find(s => s.user_id === userId);
    if (!student) return [[]];
    const alloc = dbState.ROOM_ALLOCATION.find(ra => ra.student_id === student.student_id && ra.status === "APPROVED");
    if (!alloc) return [[]];
    const room = dbState.ROOM.find(r => r.room_id === alloc.room_id);
    return [[{
      room_number: room ? room.room_number : "A-101",
      room_type: room ? room.room_type : "SINGLE",
      capacity: room ? room.capacity : 1,
      occupied_count: room ? room.occupied_count : 1,
      room_status: room ? room.status : "AVAILABLE",
      status: room ? room.status : "AVAILABLE",
      allocation_date: alloc.allocation_date,
      allocation_status: alloc.status
    }]];
  }

  if (lower.startsWith("select room_id, room_number, capacity, occupied_count, room_type, status from room order by room_number") ||
      lower.startsWith("select * from room")) {
    return [[...dbState.ROOM]];
  }

  if (lower.includes("from room where occupied_count < capacity")) {
    return [dbState.ROOM.filter(r => r.occupied_count < r.capacity)];
  }

  if (lower.startsWith("select room_id from room where room_number=?") || lower.startsWith("select room_id from room where room_number = ?")) {
    const room = dbState.ROOM.find(r => r.room_number === params[0]);
    return [room ? [{ room_id: room.room_id }] : []];
  }

  if (lower.startsWith("select occupied_count from room where room_id=?") || lower.startsWith("select capacity, occupied_count from room where room_id=?")) {
    const room = dbState.ROOM.find(r => r.room_id === Number(params[0]));
    return [room ? [room] : []];
  }

  if (lower.startsWith("insert into room")) {
    const [room_number, room_type, capacity] = params;
    const nextId = dbState.ROOM.length ? Math.max(...dbState.ROOM.map(r => r.room_id)) + 1 : 1;
    const newRoom = { room_id: nextId, room_number, room_type, capacity: Number(capacity), occupied_count: 0, status: "AVAILABLE" };
    dbState.ROOM.push(newRoom);
    return [{ insertId: nextId, affectedRows: 1 }];
  }

  if (lower.startsWith("delete from room where room_id=?")) {
    const id = Number(params[0]);
    dbState.ROOM = dbState.ROOM.filter(r => r.room_id !== id);
    return [{ affectedRows: 1 }];
  }

  if (lower.startsWith("select allocation_id from room_allocation where student_id=?")) {
    const studentId = Number(params[0]);
    const alloc = dbState.ROOM_ALLOCATION.find(ra => ra.student_id === studentId && ra.status === "APPROVED");
    return [alloc ? [alloc] : []];
  }

  if (lower.startsWith("insert into room_allocation")) {
    const [student_id, room_id, approved_by] = params;
    const nextId = dbState.ROOM_ALLOCATION.length ? Math.max(...dbState.ROOM_ALLOCATION.map(ra => ra.allocation_id)) + 1 : 1;
    dbState.ROOM_ALLOCATION.push({
      allocation_id: nextId,
      student_id: Number(student_id),
      room_id: Number(room_id),
      approved_by: Number(approved_by) || 1,
      status: "APPROVED",
      allocation_date: new Date()
    });
    return [{ insertId: nextId, affectedRows: 1 }];
  }

  if (lower.startsWith("update room set occupied_count=?, status=? where room_id=?")) {
    const [occupied, status, roomId] = params;
    const room = dbState.ROOM.find(r => r.room_id === Number(roomId));
    if (room) {
      room.occupied_count = Number(occupied);
      room.status = status;
    }
    return [{ affectedRows: 1 }];
  }

  if (lower.startsWith("update room set status=? where room_id=?")) {
    const [status, roomId] = params;
    const room = dbState.ROOM.find(r => r.room_id === Number(roomId));
    if (room) room.status = status;
    return [{ affectedRows: 1 }];
  }

  // ----------------------------------------------------
  // 4. ATTENDANCE
  // ----------------------------------------------------
  if (lower.includes("from attendance where student_id=?") || lower.includes("from attendance a where a.student_id=?")) {
    const studentId = Number(params[0]);
    const rows = dbState.ATTENDANCE.filter(a => a.student_id === studentId);
    return [rows];
  }

  if (lower.startsWith("select attendance_id from attendance where student_id=? and date=? and meal_type=?")) {
    const [studentId, date, mealType] = params;
    const row = dbState.ATTENDANCE.find(a => a.student_id === Number(studentId) && a.date === date && a.meal_type === mealType);
    return [row ? [row] : []];
  }

  if (lower.startsWith("update attendance set present=? where attendance_id=?")) {
    const [present, id] = params;
    const row = dbState.ATTENDANCE.find(a => a.attendance_id === Number(id));
    if (row) row.present = Number(present);
    return [{ affectedRows: 1 }];
  }

  if (lower.startsWith("insert into attendance")) {
    const [studentId, date, mealType, present] = params;
    const nextId = dbState.ATTENDANCE.length ? Math.max(...dbState.ATTENDANCE.map(a => a.attendance_id)) + 1 : 1;
    dbState.ATTENDANCE.push({
      attendance_id: nextId,
      student_id: Number(studentId),
      date,
      meal_type: mealType,
      present: Number(present)
    });
    return [{ insertId: nextId, affectedRows: 1 }];
  }

  if (lower.includes("round((sum(present)/count(*))*100,2) as attendance_percentage")) {
    // Attendance summary
    const summary = dbState.STUDENT.map(st => {
      const u = dbState.USER.find(user => user.user_id === st.user_id) || { username: "Student" };
      const atts = dbState.ATTENDANCE.filter(a => a.student_id === st.student_id);
      const total = atts.length || 1;
      const present = atts.filter(a => a.present === 1).length;
      return {
        student_id: st.student_id,
        roll_no: st.roll_no,
        username: u.username,
        total_records: total,
        present_count: present,
        attendance_percentage: Number(((present / total) * 100).toFixed(2))
      };
    });
    return [summary];
  }

  if (lower.includes("s.student_id, s.roll_no, u.username, meal.meal_type, a.attendance_id, ifnull(a.present,0) as present")) {
    // Attendance daily grid
    const targetDate = params[0] || "2026-10-04";
    const meals = ["BREAKFAST", "LUNCH", "DINNER"];
    const result = [];
    dbState.STUDENT.forEach(st => {
      const u = dbState.USER.find(user => user.user_id === st.user_id) || { username: "Student" };
      meals.forEach(meal => {
        const att = dbState.ATTENDANCE.find(a => a.student_id === st.student_id && a.date === targetDate && a.meal_type === meal);
        result.push({
          student_id: st.student_id,
          roll_no: st.roll_no,
          username: u.username,
          meal_type: meal,
          attendance_id: att ? att.attendance_id : null,
          present: att ? att.present : 0
        });
      });
    });
    return [result];
  }

  // ----------------------------------------------------
  // 5. LEAVE APPLICATIONS
  // ----------------------------------------------------
  if (lower.startsWith("insert into leave_application")) {
    const [student_id, reason, from_date, to_date] = params;
    const nextId = dbState.LEAVE_APPLICATION.length ? Math.max(...dbState.LEAVE_APPLICATION.map(l => l.leave_id)) + 1 : 1;
    const newLeave = {
      leave_id: nextId,
      student_id: Number(student_id),
      reason,
      from_date,
      to_date,
      status: "PENDING",
      warden_id: null,
      applied_date: new Date()
    };
    dbState.LEAVE_APPLICATION.unshift(newLeave);
    return [{ insertId: nextId, affectedRows: 1 }];
  }

  if (lower.includes("from leave_application where student_id=?") || lower.includes("from leave_application l where l.student_id=?")) {
    const studentId = Number(params[0]);
    const leaves = dbState.LEAVE_APPLICATION.filter(l => l.student_id === studentId);
    return [leaves];
  }

  if (lower.includes("from leave_application l join student s on l.student_id = s.student_id join user u on s.user_id = u.user_id") ||
      lower.includes("from leave_application l join student s on l.student_id=s.student_id join user u on s.user_id=u.user_id")) {
    const leaves = dbState.LEAVE_APPLICATION.map(l => {
      const st = dbState.STUDENT.find(s => s.student_id === l.student_id) || {};
      const u = dbState.USER.find(user => user.user_id === st.user_id) || { username: "Resident Student" };
      return {
        leave_id: l.leave_id,
        student_id: l.student_id,
        username: u.username,
        roll_no: st.roll_no || "CS202601",
        reason: l.reason,
        from_date: l.from_date,
        to_date: l.to_date,
        status: l.status,
        applied_date: l.applied_date
      };
    });
    return [leaves];
  }

  if (lower.startsWith("update leave_application set status = ? where leave_id = ?") ||
      lower.startsWith("update leave_application set status = ?, approved_by = ? where leave_id = ?") ||
      lower.startsWith("update leave_application set status=? where leave_id=?")) {
    const status = params[0];
    const leaveId = Number(params[params.length - 1]);
    const leave = dbState.LEAVE_APPLICATION.find(l => l.leave_id === leaveId);
    if (leave) {
      leave.status = status;
      if (params.length === 3) leave.warden_id = Number(params[1]);
    }
    return [{ affectedRows: 1 }];
  }

  // ----------------------------------------------------
  // 6. FEES
  // ----------------------------------------------------
  if (lower.includes("from fee where student_id=?") || lower.includes("from fee f where f.student_id=?")) {
    const studentId = Number(params[0]);
    const fees = dbState.FEE.filter(f => f.student_id === studentId);
    return [fees];
  }

  if (lower.startsWith("update fee set status='paid' where fee_id=?") || lower.startsWith("update fee set status = 'paid' where fee_id = ?")) {
    const feeId = Number(params[0]);
    const fee = dbState.FEE.find(f => f.fee_id === feeId);
    if (fee) {
      fee.status = "PAID";
      fee.paid_date = new Date();
    }
    return [{ affectedRows: 1 }];
  }

  if (lower.startsWith("update fee set status=? where fee_id=?")) {
    const [status, feeId] = params;
    const fee = dbState.FEE.find(f => f.fee_id === Number(feeId));
    if (fee) fee.status = status;
    return [{ affectedRows: 1 }];
  }

  if (lower.includes("sum(f.amount) as total_amount")) {
    // Fee report
    const report = dbState.STUDENT.map(st => {
      const u = dbState.USER.find(user => user.user_id === st.user_id) || { username: "Student" };
      const studentFees = dbState.FEE.filter(f => f.student_id === st.student_id);
      const total = studentFees.reduce((acc, cur) => acc + Number(cur.amount), 0);
      const paid = studentFees.filter(f => f.status === "PAID").reduce((acc, cur) => acc + Number(cur.amount), 0);
      return {
        student_id: st.student_id,
        roll_no: st.roll_no,
        username: u.username,
        total_amount: total.toFixed(2),
        paid_amount: paid.toFixed(2),
        pending_amount: (total - paid).toFixed(2)
      };
    });
    return [report];
  }

  // ----------------------------------------------------
  // 7. COMPLAINTS & GRIEVANCES
  // ----------------------------------------------------
  if (lower.startsWith("insert into complaint")) {
    const [student_id, category, description] = params;
    const nextId = dbState.COMPLAINT.length ? Math.max(...dbState.COMPLAINT.map(c => c.complaint_id)) + 1 : 1;
    const newComplaint = {
      complaint_id: nextId,
      student_id: Number(student_id),
      category,
      description,
      status: "OPEN",
      resolved_by: null,
      submitted_date: new Date(),
      resolved_date: null,
      resolution_notes: null
    };
    dbState.COMPLAINT.unshift(newComplaint);
    return [{ insertId: nextId, affectedRows: 1 }];
  }

  if (lower.includes("from complaint where student_id=?") || lower.includes("from complaint c where c.student_id=?")) {
    const studentId = Number(params[0]);
    const complaints = dbState.COMPLAINT.filter(c => c.student_id === studentId);
    return [complaints];
  }

  if (lower.includes("from complaint c join student s on c.student_id = s.student_id join user u on s.user_id = u.user_id") ||
      lower.includes("from complaint c join student s on c.student_id=s.student_id")) {
    const complaints = dbState.COMPLAINT.map(c => {
      const st = dbState.STUDENT.find(s => s.student_id === c.student_id) || {};
      const u = dbState.USER.find(user => user.user_id === st.user_id) || { username: "Student Resident" };
      return {
        complaint_id: c.complaint_id,
        student_id: c.student_id,
        username: u.username,
        roll_no: st.roll_no || "CS202601",
        category: c.category,
        description: c.description,
        status: c.status,
        submitted_date: c.submitted_date,
        resolved_date: c.resolved_date,
        resolution_notes: c.resolution_notes
      };
    });
    return [complaints];
  }

  if (lower.startsWith("update complaint set status = ?")) {
    const [status, notes, resolvedBy, checkStatus, complaintId] = params;
    const c = dbState.COMPLAINT.find(comp => comp.complaint_id === Number(complaintId));
    if (c) {
      c.status = status;
      c.resolution_notes = notes;
      c.resolved_by = Number(resolvedBy);
      c.resolved_date = status === "RESOLVED" ? new Date() : null;
    }
    return [{ affectedRows: 1 }];
  }

  // ----------------------------------------------------
  // 8. NOTIFICATIONS
  // ----------------------------------------------------
  if (lower.includes("from notifications where user_id=?")) {
    const userId = Number(params[0]);
    const notifs = dbState.NOTIFICATIONS.filter(n => n.user_id === userId);
    return [notifs];
  }

  // ----------------------------------------------------
  // 9. MESS / DINING
  // ----------------------------------------------------
  if (lower.includes("from menu_item")) {
    if (lower.includes("dayname(curdate())")) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = days[new Date().getDay()];
      const items = dbState.menu_item.filter(m => m.day === today);
      return [items.length ? items : dbState.menu_item.slice(0, 4)];
    }
    return [dbState.menu_item];
  }

  if (lower.startsWith("insert into menu_item")) {
    const [mess_id, name, meal_type, day] = params;
    const nextId = dbState.menu_item.length ? Math.max(...dbState.menu_item.map(m => m.item_id)) + 1 : 1;
    const newItem = { item_id: nextId, mess_id: Number(mess_id) || 1, name, meal_type, day };
    dbState.menu_item.push(newItem);
    return [{ insertId: nextId, affectedRows: 1 }];
  }

  // ----------------------------------------------------
  // 10. WARDEN & ADMIN AGGREGATES
  // ----------------------------------------------------
  if (lower.startsWith("select count(*) as total_students from student")) {
    return [[{ total_students: dbState.STUDENT.length }]];
  }

  if (lower.startsWith("select count(*) as total_rooms") || lower.includes("sum(status='available') as available_rooms")) {
    const total = dbState.ROOM.length;
    const available = dbState.ROOM.filter(r => r.status === "AVAILABLE").length;
    const occupied = dbState.ROOM.filter(r => r.status === "FULL").length;
    return [[{ total_rooms: total, available_rooms: available, occupied_rooms: occupied }]];
  }

  if (lower.startsWith("select count(*) as pending_leaves from leave_application where status='pending'")) {
    const pending = dbState.LEAVE_APPLICATION.filter(l => l.status === "PENDING").length;
    return [[{ pending_leaves: pending }]];
  }

  if (lower.startsWith("select count(*) as total_complaints")) {
    const total = dbState.COMPLAINT.length;
    const pending = dbState.COMPLAINT.filter(c => c.status !== "RESOLVED" && c.status !== "REJECTED").length;
    return [[{ total_complaints: total, pending_complaints: pending }]];
  }

  if (lower.startsWith("select count(*) as total_records, sum(present) as present_records from attendance")) {
    const total = dbState.ATTENDANCE.length;
    const present = dbState.ATTENDANCE.filter(a => a.present === 1).length;
    return [[{ total_records: total, present_records: present }]];
  }

  if (lower.startsWith("select count(*) as paid_fees from fee where status='paid'")) {
    const paid = dbState.FEE.filter(f => f.status === "PAID").length;
    return [[{ paid_fees: paid }]];
  }

  if (lower.startsWith("select count(*) as pending_fees from fee where status!='paid'")) {
    const pending = dbState.FEE.filter(f => f.status !== "PAID").length;
    return [[{ pending_fees: pending }]];
  }

  if (lower.startsWith("select count(*) as today_attendance from attendance")) {
    const today = dbState.ATTENDANCE.filter(a => a.present === 1).length;
    return [[{ today_attendance: today }]];
  }

  if (lower.startsWith("select warden_id from warden where user_id=?") || lower.startsWith("select warden_id from warden where user_id = ?")) {
    const userId = Number(params[0]);
    const w = dbState.WARDEN.find(warden => warden.user_id === userId);
    return [w ? [w] : [{ warden_id: 1 }]];
  }

  if (lower.startsWith("select manager_id from mess_manager where user_id=?") || lower.startsWith("select manager_id from mess_manager where user_id = ?")) {
    const userId = Number(params[0]);
    const m = dbState.MESS_MANAGER.find(manager => manager.user_id === userId);
    return [m ? [m] : [{ manager_id: 1 }]];
  }

  // Warden student list with room
  if (lower.includes("from student s join user u on s.user_id = u.user_id left join room_allocation ra")) {
    const queryTerm = params[0] ? String(params[0]).replace(/%/g, "").toLowerCase() : "";
    const list = dbState.STUDENT.map(st => {
      const u = dbState.USER.find(user => user.user_id === st.user_id) || { username: "Student", email: "student@hmms.edu", phone: "9876543213" };
      const alloc = dbState.ROOM_ALLOCATION.find(ra => ra.student_id === st.student_id && ra.status === "APPROVED");
      const room = alloc ? dbState.ROOM.find(r => r.room_id === alloc.room_id) : null;
      return {
        student_id: st.student_id,
        roll_no: st.roll_no,
        username: u.username,
        email: u.email,
        phone: u.phone,
        department: st.department,
        year_of_study: st.year_of_study,
        room_number: room ? room.room_number : "A-101"
      };
    }).filter(s => {
      if (!queryTerm) return true;
      return s.username.toLowerCase().includes(queryTerm) || s.roll_no.toLowerCase().includes(queryTerm);
    });
    return [list];
  }

  // Admin students list
  if ((lower.includes("from student s join user u") || lower.includes("from user u join student s")) && !lower.includes("where u.user_id") && !lower.includes("left join room_allocation")) {
    const list = dbState.STUDENT.map(st => {
      const u = dbState.USER.find(user => user.user_id === st.user_id) || { username: "Student", email: "student@hmms.edu", phone: "9876543213", user_id: st.user_id };
      return {
        student_id: st.student_id,
        roll_no: st.roll_no,
        username: u.username,
        email: u.email,
        phone: u.phone,
        department: st.department,
        year_of_study: st.year_of_study,
        guardian_contact: st.guardian_contact,
        user_id: u.user_id
      };
    });
    return [list];
  }

  // Admin wardens list
  if (lower.includes("from warden w join user u") || lower.includes("from user u join warden w")) {
    const list = dbState.WARDEN.map(w => {
      const u = dbState.USER.find(user => user.user_id === w.user_id) || { username: "warden", email: "warden@hmms.edu", phone: "9876543211", user_id: w.user_id };
      return {
        user_id: u.user_id,
        username: u.username,
        email: u.email,
        phone: u.phone,
        warden_id: w.warden_id,
        hostel_block: w.hostel_block || "Block A"
      };
    });
    return [list];
  }

  // Admin mess managers list
  if (lower.includes("from mess_manager mm join user u") || lower.includes("from mess_manager m join user u") || lower.includes("from user u join mess_manager")) {
    const list = dbState.MESS_MANAGER.map(m => {
      const u = dbState.USER.find(user => user.user_id === m.user_id) || { username: "messmanager", email: "mess@hmms.edu", phone: "9876543212", user_id: m.user_id };
      return {
        user_id: u.user_id,
        username: u.username,
        email: u.email,
        phone: u.phone,
        manager_id: m.manager_id,
        mess_name: m.mess_name || "Central Dining Hall"
      };
    });
    return [list];
  }

  if (lower.startsWith("select user_id from warden where warden_id=?") || lower.startsWith("select user_id from warden where warden_id = ?")) {
    const w = dbState.WARDEN.find(warden => warden.warden_id === Number(params[0]));
    return [w ? [{ user_id: w.user_id }] : []];
  }

  if (lower.startsWith("select user_id from mess_manager where manager_id=?") || lower.startsWith("select user_id from mess_manager where manager_id = ?")) {
    const m = dbState.MESS_MANAGER.find(manager => manager.manager_id === Number(params[0]));
    return [m ? [{ user_id: m.user_id }] : []];
  }

  if (lower.startsWith("delete from warden where warden_id=?") || lower.startsWith("delete from warden where warden_id = ?")) {
    const id = Number(params[0]);
    dbState.WARDEN = dbState.WARDEN.filter(w => w.warden_id !== id);
    return [{ affectedRows: 1 }];
  }

  if (lower.startsWith("delete from mess_manager where manager_id=?") || lower.startsWith("delete from mess_manager where manager_id = ?")) {
    const id = Number(params[0]);
    dbState.MESS_MANAGER = dbState.MESS_MANAGER.filter(m => m.manager_id !== id);
    return [{ affectedRows: 1 }];
  }

  // Update user
  if (lower.startsWith("update user set username=?,email=?,phone=? where user_id=?") ||
      lower.startsWith("update user set username=?, email=?, phone=? where user_id=?")) {
    const [username, email, phone, userId] = params;
    const u = dbState.USER.find(user => user.user_id === Number(userId));
    if (u) {
      u.username = username;
      u.email = email;
      u.phone = phone;
    }
    return [{ affectedRows: 1 }];
  }

  // Update student
  if (lower.startsWith("update student set roll_no=?,department=?,year_of_study=?,guardian_contact=? where student_id=?") ||
      lower.startsWith("update student set roll_no=?, department=?, year_of_study=?, guardian_contact=? where student_id=?")) {
    const [roll_no, department, year_of_study, guardian_contact, studentId] = params;
    const st = dbState.STUDENT.find(s => s.student_id === Number(studentId));
    if (st) {
      st.roll_no = roll_no;
      st.department = department;
      st.year_of_study = year_of_study;
      st.guardian_contact = guardian_contact;
    }
    return [{ affectedRows: 1 }];
  }

  // Delete student
  if (lower.startsWith("delete from student where student_id=?")) {
    const id = Number(params[0]);
    dbState.STUDENT = dbState.STUDENT.filter(s => s.student_id !== id);
    return [{ affectedRows: 1 }];
  }

  // Delete user
  if (lower.startsWith("delete from user where user_id=?")) {
    const id = Number(params[0]);
    dbState.USER = dbState.USER.filter(u => u.user_id !== id);
    return [{ affectedRows: 1 }];
  }

  // Fallback safe default
  console.log(`[MockDB] Unhandled query: ${s.substring(0, 100)}... Returning empty dataset.`);
  return [[]];
}

const mockPool = {
  getConnection: async () => ({
    config: { database: "in_memory_defaultdb" },
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: () => {},
    execute: async (sql, params) => executeMockQuery(sql, params),
    query: async (sql, params) => executeMockQuery(sql, params)
  }),
  execute: async (sql, params) => executeMockQuery(sql, params),
  query: async (sql, params) => executeMockQuery(sql, params),
  resetData: () => {
    dbState = initialData();
  }
};

module.exports = mockPool;
