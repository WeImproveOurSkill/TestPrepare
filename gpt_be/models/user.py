from sqlalchemy import Column, Integer, String, Enum, Table, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import enum

class Role(enum.Enum):
    COMMON = "COMMON"
    ADMIN = "ADMIN"

# 다대다 관계를 위한 연결 테이블
user_certification = Table(
    'user_certification',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('certification_id', Integer, ForeignKey('certification.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    password = Column(String)
    email = Column(String, unique=True, index=True)
    nickname = Column(String)
    oauth2Id = Column(String)
    role = Column(Enum(Role), default=Role.COMMON)
    provider = Column(String)  # OAuth2 제공자
    providerId = Column(String)
    
    # 다대다 관계 설정
    certifications = relationship(
        "Certification",
        secondary=user_certification,
        backref="users"
    )
    
    # UserStudyPattern과의 일대다 관계 추가
    study_patterns = relationship("UserStudyPattern", back_populates="user") 