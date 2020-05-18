from django.test import TestCase
from .logic import get_data
from unittest.mock import Mock, patch
from functools import partial
from .exceptions import BadRequestException

# Create your tests here.
class TestGetData(TestCase):
    class FackeRequest:
        pass

    def setUp(self):
        
        self.request = self.FackeRequest()
        self.request.data = {
            "int": "1",
            "float": "1.0034",
            "string": "akfvak",
            "arr_int": ["1", "2", "3"]
        }

    
    def testSmoke(self):
        self.assertEqual(
            get_data(
                self.request,
                "data",
                {
                    "int": int,
                    "float": float,
                    "arr_int": lambda x: list(map(int,x))
                }
            ),
            (1, 1.0034, [1, 2, 3])
        )

    def testNotData(self):
        with self.assertRaises(BadRequestException):
            get_data(self.request, "not_data", {})
    
    def testBadData(self):
        with self.assertRaises(BadRequestException):
            get_data(self.request, "data", {"arg": str})

class TestGenerateTemplate(TestCase):
    def setUp(self):
        pass
        