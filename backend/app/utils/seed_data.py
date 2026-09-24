"""Seed database with realistic initial data for KisanFlow SIH 2026 demonstration."""
import sys
import os
import random
from datetime import datetime, timedelta

# Ensure parent directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.config.database import SessionLocal, engine, Base
from app.models.models import (
    User, Farmer, Officer, Admin, Center, Crop, CropPrice,
    Slot, Token, Counter, HistoricalQueueData,
    UserRole, TokenStatus, ProcurementStage, CenterStatus, CounterStatus, SlotStatus
)
from app.services.auth_service import hash_password
from app.ml.train import train_initial_model


def seed_database():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).first():
            print("Database already contains data. Skipping re-seed.")
            return

        print("Seeding crops...")
        crops_data = [
            {"name": "Wheat", "name_mr": "गहू", "name_hi": "गेहूं", "unit": "quintal", "reference_price": 2425.0, "msp": 2425.0},
            {"name": "Cotton", "name_mr": "कापूस", "name_hi": "कपास", "unit": "quintal", "reference_price": 7100.0, "msp": 7020.0},
            {"name": "Rice", "name_mr": "भात (धान)", "name_hi": "धान", "unit": "quintal", "reference_price": 2369.0, "msp": 2369.0},
            {"name": "Soybean", "name_mr": "सोयाबीन", "name_hi": "सोयाबीन", "unit": "quintal", "reference_price": 4892.0, "msp": 4892.0},
            {"name": "Jowar", "name_mr": "ज्वारी", "name_hi": "ज्वार", "unit": "quintal", "reference_price": 3699.0, "msp": 3699.0},
            {"name": "Bajra", "name_mr": "बाजरी", "name_hi": "बाजरा", "unit": "quintal", "reference_price": 2775.0, "msp": 2775.0},
            {"name": "Maize", "name_mr": "मका", "name_hi": "मक्का", "unit": "quintal", "reference_price": 2225.0, "msp": 2225.0},
        ]
        crop_objs = []
        for c in crops_data:
            crop = Crop(**c)
            db.add(crop)
            crop_objs.append(crop)
        db.commit()

        print("Seeding procurement centers...")
        centers_data = [
            {
                "center_code": "PC-PUN-01",
                "name": "Pune Agriculture Procurement Center (APMC Market Yard)",
                "district": "Pune",
                "address": "Gultekdi Market Yard, Pune, Maharashtra 411037",
                "latitude": 18.4905,
                "longitude": 73.8687,
                "total_counters": 4,
                "active_counters": 3,
                "capacity": 150,
                "average_processing_time": 12.0
            },
            {
                "center_code": "PC-BAR-02",
                "name": "Baramati Kisan Sahakari Procurement Yard",
                "district": "Pune",
                "address": "MIDC Area, Baramati, Maharashtra 413133",
                "latitude": 18.1517,
                "longitude": 74.5772,
                "total_counters": 4,
                "active_counters": 2,
                "capacity": 120,
                "average_processing_time": 15.0
            },
            {
                "center_code": "PC-NSK-03",
                "name": "Nashik Agri Grain Procurement Center",
                "district": "Nashik",
                "address": "Panchavati Market Yard, Nashik, Maharashtra 422003",
                "latitude": 20.0110,
                "longitude": 73.7903,
                "total_counters": 5,
                "active_counters": 4,
                "capacity": 200,
                "average_processing_time": 11.0
            },
            {
                "center_code": "PC-NGP-04",
                "name": "Nagpur Vidarbha Cotton & Grain Yard",
                "district": "Nagpur",
                "address": "Kalamna Market, Nagpur, Maharashtra 440008",
                "latitude": 21.1612,
                "longitude": 79.1419,
                "total_counters": 4,
                "active_counters": 2,
                "capacity": 140,
                "average_processing_time": 16.0
            },
            {
                "center_code": "PC-SOL-05",
                "name": "Solapur Jowar & Grain Procurement Hub",
                "district": "Solapur",
                "address": "Siddheshwar Mandi, Solapur, Maharashtra 413001",
                "latitude": 17.6599,
                "longitude": 75.9064,
                "total_counters": 3,
                "active_counters": 2,
                "capacity": 100,
                "average_processing_time": 14.0
            },
            {
                "center_code": "PC-AUR-06",
                "name": "Chhatrapati Sambhajinagar Cotton Procurement Yard",
                "district": "Chhatrapati Sambhajinagar",
                "address": "Jalna Road APMC, Maharashtra 431001",
                "latitude": 19.8762,
                "longitude": 75.3433,
                "total_counters": 4,
                "active_counters": 3,
                "capacity": 160,
                "average_processing_time": 13.0
            },
        ]
        center_objs = []
        for cd in centers_data:
            cntr = Center(**cd, status=CenterStatus.ACTIVE)
            db.add(cntr)
            center_objs.append(cntr)
        db.commit()

        # Seed counters for each center
        print("Seeding counters...")
        for c in center_objs:
            for num in range(1, c.total_counters + 1):
                status_val = CounterStatus.ACTIVE if num <= c.active_counters else CounterStatus.INACTIVE
                counter = Counter(
                    center_id=c.id,
                    counter_number=num,
                    status=status_val,
                    activated_at=datetime.utcnow() if status_val == CounterStatus.ACTIVE else None
                )
                db.add(counter)
        db.commit()

        # Seed crop prices for centers
        print("Seeding crop prices...")
        for c in center_objs:
            for cr in crop_objs:
                price_variance = round(random.uniform(-15.0, 25.0), 0)
                price_val = max(cr.msp, cr.reference_price + price_variance)
                cp = CropPrice(
                    crop_id=cr.id,
                    center_id=c.id,
                    price=price_val,
                    source="official_msp_portal"
                )
                db.add(cp)
        db.commit()

        # Seed slots for today, tomorrow, and day after
        print("Seeding slots...")
        today = datetime.utcnow().date()
        slot_times = [
            ("09:00", "10:00"),
            ("10:00", "11:00"),
            ("11:00", "12:00"),
            ("12:00", "13:00"),
            ("14:00", "15:00"),
            ("15:00", "16:00"),
            ("16:00", "17:00")
        ]
        for c in center_objs:
            for day_offset in range(3):
                date_str = (today + timedelta(days=day_offset)).strftime("%Y-%m-%d")
                for st, et in slot_times:
                    slot = Slot(
                        center_id=c.id,
                        date=date_str,
                        start_time=st,
                        end_time=et,
                        total_capacity=25,
                        booked=random.randint(5, 18),
                        status=SlotStatus.AVAILABLE
                    )
                    db.add(slot)
        db.commit()

        # Seed Admin
        print("Seeding admin...")
        admin_user = User(
            username="admin001",
            password_hash=hash_password("admin123"),
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        admin = Admin(
            user_id=admin_user.id,
            admin_id="ADMIN001",
            name="Vikramaditya Shinde (State Agricultural Commissioner)",
            department="Department of Agriculture, Govt of Maharashtra"
        )
        db.add(admin)
        db.commit()

        # Seed Officers
        print("Seeding officers...")
        officer_names = [
            ("OFF1001", "Sanjay Deshmukh (Procurement Officer)", center_objs[0].id),
            ("OFF1002", "Anand Kulkarni (Quality Inspector)", center_objs[1].id),
            ("OFF1003", "Nitin Jadhav (Weighbridge Incharge)", center_objs[2].id),
            ("OFF1004", "Prakash Wankhede (Verification Officer)", center_objs[3].id),
            ("OFF1005", "Sunil Shinde (Yard Supervisor)", center_objs[4].id),
            ("OFF1006", "Mahesh Gaikwad (Procurement Officer)", center_objs[5].id),
        ]
        for off_id, off_name, cid in officer_names:
            u = User(
                username=off_id.lower(),
                password_hash=hash_password("officer123"),
                role=UserRole.OFFICER,
                is_active=True
            )
            db.add(u)
            db.commit()
            db.refresh(u)

            off = Officer(
                user_id=u.id,
                officer_id=off_id,
                name=off_name,
                mobile_number="9876543210",
                center_id=cid
            )
            db.add(off)
        db.commit()

        # Seed Farmers (30+ farmers)
        print("Seeding farmers...")
        farmer_names = [
            ("FARM1001", "Rajesh Baburao Pawar", "9822011001", "Shivane", "Pune", "mr"),
            ("FARM1002", "Ramesh Tukaram Patil", "9822011002", "Manchar", "Pune", "mr"),
            ("FARM1003", "Dnyaneshwar Maruti Shinde", "9822011003", "Alephata", "Pune", "mr"),
            ("FARM1004", "Balasaheb Ramchandra More", "9822011004", "Saswad", "Pune", "mr"),
            ("FARM1005", "Ashok Pandurang Jagtap", "9822011005", "Baramati", "Pune", "mr"),
            ("FARM1006", "Santosh Namdeo Kadam", "9822011006", "Daund", "Pune", "mr"),
            ("FARM1007", "Pandurang Vithoba Ghadge", "9822011007", "Indapur", "Pune", "mr"),
            ("FARM1008", "Vilas Shankar Chavan", "9822011008", "Shirur", "Pune", "mr"),
            ("FARM1009", "Suresh Sopan Thorat", "9822011009", "Junnar", "Pune", "mr"),
            ("FARM1010", "Ganesh Bhimrao Gaikwad", "9822011010", "Khed", "Pune", "mr"),
            ("FARM1011", "Vijay Kisanrao Raut", "9822011011", "Niphad", "Nashik", "mr"),
            ("FARM1012", "Eknath Mahadu Khairnar", "9822011012", "Sinnar", "Nashik", "mr"),
            ("FARM1013", "Kishor Trimbak Borse", "9822011013", "Yeola", "Nashik", "mr"),
            ("FARM1014", "Deepak Kashinath Sonawane", "9822011014", "Dindori", "Nashik", "mr"),
            ("FARM1015", "Chandrakant Pralhad Joshi", "9822011015", "Satana", "Nashik", "mr"),
            ("FARM1016", "Sudhir Babanrao Deshmukh", "9822011016", "Katol", "Nagpur", "hi"),
            ("FARM1017", "Anil Haribhau Mehra", "9822011017", "Saoner", "Nagpur", "hi"),
            ("FARM1018", "Manoj Ramdasji Tijare", "9822011018", "Umred", "Nagpur", "hi"),
            ("FARM1019", "Raju Govindrao Bondre", "9822011019", "Hingna", "Nagpur", "hi"),
            ("FARM1020", "Pravin Shridharrao Kale", "9822011020", "Narkhed", "Nagpur", "hi"),
            ("FARM1021", "Mahadev Siddheshwar Birajdar", "9822011021", "Akkalkot", "Solapur", "mr"),
            ("FARM1022", "Basavaraj Revansiddha Swami", "9822011022", "South Solapur", "Solapur", "mr"),
            ("FARM1023", "Shashikant Mallikarjun Pujari", "9822011023", "Barshi", "Solapur", "mr"),
            ("FARM1024", "Appasaheb Dattatraya Patil", "9822011024", "Pandharpur", "Solapur", "mr"),
            ("FARM1025", "Shivaji Jaywantrao Salunkhe", "9822011025", "Mohol", "Solapur", "mr"),
            ("FARM1026", "Subhash Asaramji Ghodke", "9822011026", "Paithan", "Chhatrapati Sambhajinagar", "mr"),
            ("FARM1027", "Prabhakar Vishwanathrao Chavan", "9822011027", "Gangapur", "Chhatrapati Sambhajinagar", "mr"),
            ("FARM1028", "Dnyanoba Kondiba Autade", "9822011028", "Vaijapur", "Chhatrapati Sambhajinagar", "mr"),
            ("FARM1029", "Kalyanrao Bhagoji Kakade", "9822011029", "Kannad", "Chhatrapati Sambhajinagar", "mr"),
            ("FARM1030", "Bhausaheb Raosaheb Magar", "9822011030", "Sillod", "Chhatrapati Sambhajinagar", "mr"),
        ]

        farmer_objs = []
        for fid, fname, fmob, fvil, fdist, flang in farmer_names:
            u = User(
                username=fid.lower(),
                password_hash=None,  # OTP based login
                role=UserRole.FARMER,
                is_active=True
            )
            db.add(u)
            db.commit()
            db.refresh(u)

            frm = Farmer(
                user_id=u.id,
                farmer_id=fid,
                name=fname,
                mobile_number=fmob,
                village=fvil,
                district=fdist,
                latitude=18.5204 + random.uniform(-0.15, 0.15),
                longitude=73.8567 + random.uniform(-0.15, 0.15),
                preferred_language=flang
            )
            db.add(frm)
            farmer_objs.append(frm)
        db.commit()

        # Seed Tokens (At least 50 tokens)
        print("Seeding tokens and queues...")
        pune_center = center_objs[0]
        wheat_crop = crop_objs[0]

        # Explicit Demo Token for Rajesh Pawar (FARM1001) as required by SIH presentation:
        # Token: KF-2026-000123, Crop: Wheat, Quantity: 35 Q, Center: Pune, Position #12, 11 ahead, 25 min wait
        demo_token = Token(
            token_id="KF-2026-000123",
            farmer_id=farmer_objs[0].id,
            center_id=pune_center.id,
            crop_id=wheat_crop.id,
            quantity=35.0,
            status=TokenStatus.IN_QUEUE,
            current_stage=ProcurementStage.REGISTRATION,
            queue_position=12,
            estimated_wait=25.0,
            procurement_rate=2425.0,
            created_at=datetime.utcnow() - timedelta(minutes=45)
        )
        db.add(demo_token)

        # Seed tokens 1 to 11 ahead of Rajesh at Pune Center
        for i in range(1, 12):
            t = Token(
                token_id=f"KF-2026-{100 + i:06d}",
                farmer_id=farmer_objs[i % len(farmer_objs)].id,
                center_id=pune_center.id,
                crop_id=crop_objs[i % len(crop_objs)].id,
                quantity=round(random.uniform(20.0, 50.0), 1),
                status=TokenStatus.IN_QUEUE if i > 2 else TokenStatus.IN_PROGRESS,
                current_stage=ProcurementStage.WEIGHING if i <= 2 else ProcurementStage.VERIFICATION,
                queue_position=i,
                counter_id=i if i <= pune_center.active_counters else None,
                estimated_wait=round((i / pune_center.active_counters) * pune_center.average_processing_time, 1),
                procurement_rate=2425.0,
                created_at=datetime.utcnow() - timedelta(minutes=90 - i * 4)
            )
            db.add(t)

        # Seed completed & additional tokens for other centers to exceed 50 tokens
        token_counter = 125
        for c in center_objs:
            # 5 completed tokens per center
            for _ in range(5):
                t = Token(
                    token_id=f"KF-2026-{token_counter:06d}",
                    farmer_id=random.choice(farmer_objs).id,
                    center_id=c.id,
                    crop_id=random.choice(crop_objs).id,
                    quantity=35.0,
                    actual_quantity=34.6,
                    status=TokenStatus.COMPLETED,
                    current_stage=ProcurementStage.PAYMENT,
                    procurement_rate=2425.0,
                    total_amount=83905.0,
                    created_at=datetime.utcnow() - timedelta(hours=random.randint(2, 6))
                )
                db.add(t)
                token_counter += 1

            # 3 active tokens per other center
            if c.id != pune_center.id:
                for q_pos in range(1, 4):
                    t = Token(
                        token_id=f"KF-2026-{token_counter:06d}",
                        farmer_id=random.choice(farmer_objs).id,
                        center_id=c.id,
                        crop_id=random.choice(crop_objs).id,
                        quantity=round(random.uniform(25.0, 60.0), 1),
                        status=TokenStatus.IN_QUEUE,
                        current_stage=ProcurementStage.REGISTRATION,
                        queue_position=q_pos,
                        estimated_wait=round((q_pos / c.active_counters) * c.average_processing_time, 1),
                        procurement_rate=2425.0,
                        created_at=datetime.utcnow() - timedelta(minutes=random.randint(10, 40))
                    )
                    db.add(t)
                    token_counter += 1
        db.commit()

        # Seed historical data (several hundred records for analytics & ML)
        print("Seeding historical queue records...")
        hist_count = 0
        for c in center_objs:
            for day_back in range(1, 15):
                dt_str = (today - timedelta(days=day_back)).strftime("%Y-%m-%d")
                for hr in range(8, 18):
                    q_len = random.randint(3, 28)
                    proc_time = c.average_processing_time + random.uniform(-2.0, 3.0)
                    tokens_proc = random.randint(4, 16)
                    actual_wait = round((q_len / c.active_counters) * proc_time + random.uniform(-3, 3), 1)

                    rec = HistoricalQueueData(
                        center_id=c.id,
                        date=dt_str,
                        hour=hr,
                        queue_length=q_len,
                        active_counters=c.active_counters,
                        tokens_processed=tokens_proc,
                        average_processing_time=round(proc_time, 1),
                        crop=random.choice(["Wheat", "Rice", "Cotton", "Soybean"]),
                        actual_wait_minutes=max(5.0, actual_wait)
                    )
                    db.add(rec)
                    hist_count += 1
        db.commit()
        print(f"Successfully seeded {hist_count} historical queue records!")

        # Train ML model on seeded baseline data
        print("Training Scikit-learn RandomForest model...")
        train_initial_model()

        print("=== KISANFLOW DATABASE SEEDING COMPLETED SUCCESSFULLY ===")
        print("Demo Accounts:")
        print("Farmer: ID=FARM1001, OTP=123456 (Rajesh Pawar)")
        print("Officer: ID=OFF1001, Password=officer123 (Sanjay Deshmukh)")
        print("Admin: ID=ADMIN001, Password=admin123 (Vikramaditya Shinde)")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
