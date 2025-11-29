"""
Integration tests for design API endpoints.
Uses FastAPI TestClient with dependency overrides for isolated testing.
"""

from fastapi.testclient import TestClient
from app.main import app
from app.api.designs import get_design_service, get_drc_service
from app.domain.services import DesignService, DRCService
from app.infra.memory_repo import DesignRepository
from app.domain.models import Design, Board


def get_test_design_service():
    """Provide a fresh DesignService with in-memory repo for testing."""
    return DesignService(DesignRepository())


def get_test_drc_service():
    """Provide a fresh DRCService for testing."""
    return DRCService()


# Override dependencies for testing
app.dependency_overrides[get_design_service] = get_test_design_service
app.dependency_overrides[get_drc_service] = get_test_drc_service

client = TestClient(app)


def test_create_design():
    """Test creating a new design."""
    design_payload = {
        "id": "test-1",
        "name": "Test Design",
        "board": {
            "outline": [],
            "components": [],
            "nets": [],
            "layers": 1,
        },
    }

    response = client.post("/designs", json=design_payload)
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == "test-1"
    assert data["name"] == "Test Design"
    assert data["board"]["layers"] == 1


def test_get_design():
    """Test retrieving a design by ID."""
    # First create a design
    design_payload = {
        "id": "test-get",
        "name": "Get Test",
        "board": {"outline": [], "components": [], "nets": [], "layers": 1},
    }
    client.post("/designs", json=design_payload)

    # Then retrieve it
    response = client.get("/designs/test-get")
    assert response.status_code == 200
    assert response.json()["id"] == "test-get"


def test_get_nonexistent_design():
    """Test retrieving a non-existent design returns 404."""
    response = client.get("/designs/nonexistent")
    assert response.status_code == 404


def test_validate_design_with_unconnected_net():
    """Test validation detects unconnected nets."""
    # Create design with unconnected net
    design_payload = {
        "id": "test-validate",
        "name": "Validation Test",
        "board": {
            "outline": [],
            "components": [],
            "nets": [
                {
                    "id": "net1",
                    "connection_ids": ["R1.1"],  # Only 1 connection - unconnected!
                    "name": "LED_ANODE",
                }
            ],
            "layers": 1,
        },
    }
    client.post("/designs", json=design_payload)

    # Validate
    response = client.post("/designs/test-validate/validate")
    assert response.status_code == 200

    data = response.json()
    assert "issues" in data
    assert len(data["issues"]) > 0

    # Check that we got an unconnected_net issue
    unconnected_issues = [
        i for i in data["issues"] if i.get("type") == "unconnected_net"
    ]
    assert len(unconnected_issues) > 0
    assert unconnected_issues[0]["severity"] == "error"


def test_validate_design_with_short_circuit():
    """Test validation detects short circuits."""
    # Create design with pin connected to multiple nets
    design_payload = {
        "id": "test-short",
        "name": "Short Circuit Test",
        "board": {
            "outline": [],
            "components": [],
            "nets": [
                {"id": "net1", "connection_ids": ["R1.1"]},
                {"id": "net2", "connection_ids": ["R1.1"]},  # Same pin!
            ],
            "layers": 1,
        },
    }
    client.post("/designs", json=design_payload)

    # Validate
    response = client.post("/designs/test-short/validate")
    assert response.status_code == 200

    data = response.json()
    short_issues = [i for i in data["issues"] if i.get("type") == "short_circuit"]
    assert len(short_issues) > 0


def test_validate_design_missing_board_outline():
    """Test validation detects missing board outline."""
    design_payload = {
        "id": "test-outline",
        "name": "Outline Test",
        "board": {
            "outline": [],  # Empty outline
            "components": [],
            "nets": [],
            "layers": 1,
        },
    }
    client.post("/designs", json=design_payload)

    response = client.post("/designs/test-outline/validate")
    assert response.status_code == 200

    data = response.json()
    outline_issues = [i for i in data["issues"] if i.get("type") == "board_edge"]
    assert len(outline_issues) > 0


def test_list_designs():
    """Test listing all designs."""
    # Create a few designs
    for i in range(3):
        design_payload = {
            "id": f"list-test-{i}",
            "name": f"List Test {i}",
            "board": {"outline": [], "components": [], "nets": [], "layers": 1},
        }
        client.post("/designs", json=design_payload)

    # List all
    response = client.get("/designs")
    assert response.status_code == 200

    data = response.json()
    assert len(data) >= 3
    assert any(d["id"] == "list-test-0" for d in data)


def test_update_design():
    """Test updating an existing design."""
    # Create
    design_payload = {
        "id": "test-update",
        "name": "Original",
        "board": {"outline": [], "components": [], "nets": [], "layers": 1},
    }
    client.post("/designs", json=design_payload)

    # Update
    updated_payload = {
        "id": "test-update",
        "name": "Updated",
        "board": {"outline": [], "components": [], "nets": [], "layers": 1},
    }
    response = client.put("/designs/test-update", json=updated_payload)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated"


def test_delete_design():
    """Test deleting a design."""
    # Create
    design_payload = {
        "id": "test-delete",
        "name": "To Delete",
        "board": {"outline": [], "components": [], "nets": [], "layers": 1},
    }
    client.post("/designs", json=design_payload)

    # Delete
    response = client.delete("/designs/test-delete")
    assert response.status_code == 200

    # Verify it's gone
    response = client.get("/designs/test-delete")
    assert response.status_code == 404

